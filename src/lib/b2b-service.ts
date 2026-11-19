import 'server-only';

import { notifyB2BPartnerAlert } from '@/lib/alerts';
import {
  B2B_DESTINATION_OPTIONS,
  B2B_FAQS,
  B2B_MONTHLY_VOLUMES,
  B2B_ORGANIZATION_TYPES,
  B2B_PROTECTIONS,
  B2B_SERVICE_TRACKS,
  B2B_SLAS,
  B2B_SOP_STAGES,
  formatPartnershipTypeLabel,
  type NormalizedB2BInquiry,
} from '@/lib/b2b-catalog';
import { config } from '@/lib/config';
import { countries } from '@/lib/countries';
import { logActivityEvent } from '@/lib/crm-operations';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import prisma from '@/lib/prisma';
import { getPublicTrustRecords } from '@/lib/trust-records';

export async function getB2BServiceCatalog() {
  let office: {
    name: string;
    address: string;
    phonePrimary: string;
    phoneSecondary?: string | null;
    email?: string | null;
    hours: string;
  } = DEFAULT_OFFICE_RECORD;

  try {
    const { offices } = await getPublicTrustRecords();
    const head = offices.find((o) => o.isHeadOffice) ?? offices[0];
    if (head) office = head;
  } catch {
    // Fall back to canonical office record during DB-less static build.
  }

  const activeDestinationCount = countries.filter((c) => c.isActive).length;
  const whatsappDigits = (office.phonePrimary || config.contact.whatsapp).replace(/\D/g, '');

  return {
    activeDestinationCount,
    tracks: B2B_SERVICE_TRACKS,
    organizationTypes: B2B_ORGANIZATION_TYPES,
    destinations: B2B_DESTINATION_OPTIONS,
    monthlyVolumes: B2B_MONTHLY_VOLUMES,
    slas: B2B_SLAS,
    sopStages: B2B_SOP_STAGES,
    protections: B2B_PROTECTIONS,
    faqs: B2B_FAQS,
    commercialPolicy: {
      mode: 'custom_mou' as const,
      summary:
        'Commercial fees, partner commissions, payout triggers, and refund conditions are confirmed in a bilateral written MOU tailored to destination and monthly volume after partner vetting.',
    },
    partnerDesk: {
      name: office.name,
      address: office.address,
      phone: office.phonePrimary,
      alternatePhone: office.phoneSecondary || config.contact.alternatePhone,
      email: office.email || config.contact.email,
      hours: office.hours,
      whatsappUrl: `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
        'Hello EduExpress B2B Desk, I would like to discuss agency/sub-agent onboarding and written MOU terms.',
      )}`,
    },
  };
}

export async function createB2BPartnerInquiry(
  inquiry: NormalizedB2BInquiry,
  context: { ipAddress: string; userAgent: string },
): Promise<{ created: boolean; id: string; priority: string; referenceCode: string }> {
  const duplicate = await prisma.partnership.findFirst({
    where: {
      email: inquiry.email,
      phone: inquiry.phone,
      createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
    },
    orderBy: { createdAt: 'desc' },
    select: { id: true, priority: true },
  });

  if (duplicate) {
    return {
      created: false,
      id: duplicate.id,
      priority: duplicate.priority,
      referenceCode: `B2B-${duplicate.id.slice(-6).toUpperCase()}`,
    };
  }

  const partnership = await prisma.partnership.create({
    data: {
      companyName: inquiry.companyName,
      businessType: inquiry.businessType,
      businessRegistrationNumber: inquiry.businessRegistrationNumber || null,
      website: inquiry.website || null,
      yearsInBusiness: inquiry.yearsInBusiness,
      contactPerson: inquiry.contactPerson,
      email: inquiry.email,
      phone: inquiry.phone,
      address: inquiry.address,
      city: inquiry.city,
      state: inquiry.state,
      country: inquiry.country,
      postalCode: inquiry.postalCode,
      partnershipType: inquiry.partnershipType,
      targetCountries: JSON.stringify(inquiry.targetCountries),
      currentClients: inquiry.currentClients,
      monthlyTarget: inquiry.monthlyTarget,
      experience: inquiry.experience,
      investmentCapacity: 'custom-mou',
      expectedCommission: inquiry.expectedCommission,
      marketingChannels: JSON.stringify(['B2B Partner Desk']),
      socialMediaPresence: JSON.stringify({}),
      localNetwork: inquiry.localNetwork,
      referralSources: JSON.stringify([inquiry.source]),
      documents: JSON.stringify({}),
      motivation: inquiry.motivation,
      expectations: inquiry.expectations,
      additionalInfo: inquiry.additionalInfo || null,
      status: 'pending',
      priority: inquiry.priority,
      source: inquiry.source,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      consentTimestamp: inquiry.consentTimestamp,
      consentPolicyVersion: inquiry.consentPolicyVersion,
    },
    select: { id: true, priority: true },
  });

  return {
    created: true,
    id: partnership.id,
    priority: partnership.priority,
    referenceCode: `B2B-${partnership.id.slice(-6).toUpperCase()}`,
  };
}

export async function recordB2BPartnerEffects(input: {
  id: string;
  inquiry: NormalizedB2BInquiry;
}): Promise<void> {
  const trackLabel = formatPartnershipTypeLabel(input.inquiry.partnershipType);
  await Promise.allSettled([
    logActivityEvent({
      type: 'b2b_inquiry_created',
      actorName: 'B2B Partner Desk',
      toValue: input.inquiry.companyName,
      details: `${trackLabel} · ${input.inquiry.targetCountries.join(', ')} · ~${input.inquiry.monthlyTarget}/mo (${input.inquiry.contactPerson})`,
    }),
    notifyB2BPartnerAlert({
      id: input.id,
      companyName: input.inquiry.companyName,
      contactPerson: input.inquiry.contactPerson,
      phone: input.inquiry.phone,
      email: input.inquiry.email,
      city: input.inquiry.city,
      country: input.inquiry.country,
      serviceTrackLabel: trackLabel,
      targetCountries: input.inquiry.targetCountries,
      monthlyTarget: input.inquiry.monthlyTarget,
      priority: input.inquiry.priority,
    }),
  ]);
}
