# Admin leads and Meta diagnostics

## Interface direction

Framed sheet, seed 760118153, from the frontend skill's support/list/detail draw. The question is: which student needs the admissions team's next follow-up? The product's face is EduExpress's blue on new-enquiry data and its named admissions workspace. The signature is a work queue grouped into New, No Response, In progress and Completed / closed, with every figure calculated from the same loaded rows.

The shared shell is light with a single white work surface. Search, destination/source/status filters, ordering and pagination remain. Contact actions, study interest and source are grouped together; detailed messages, assessment information and internal notes live in a keyboard-accessible dialog. Existing lead deletion remains available with its confirmation. No deletion was performed and its existing backend handler was left unchanged after automated review rejected a proposed handler rewrite.

The design lint has zero failures; the floating dialog's shadow is the one justified warning. Browser screenshots compare the original and redesigned screens on the available 784px browser viewport. The browser automation policy permits CUA only, so the skill's independent browser inspector was not run and no 390px or 1440px visual result is claimed. The implementation retains responsive navigation, row layout and touch controls.

## Status and data handling

One shared No Response (`no_response`) value supplies the queue, filters, row and detail status options, and API validation. Status/notes updates reject protected columns and unknown values. Missing figures remain dashes; zero queue totals remain zero. No schema migration or production lead import is needed. Existing user/lead records are retained.

Tests cover queue partitioning, combined filters, sorting, No Response writes, bounded notes, protected-field rejection and correct international contact links. Local HTTP tests use only an isolated database of fictional `example.test` enquiries. They verify authentication, no-store responses, No Response persistence, notes saving and safe errors. Browser checks confirm persistence after refreshing, internal note saving, Escape closing and the empty search state.

## Meta connection diagnosis

Production had no saved Meta token and an empty `META_ACCESS_TOKEN` environment value. That is a real setup gap, not grounds to display Active. The user was asked to enter a token into Admin Settings rather than chat. The dashboard and Settings now share the same private status API and distinguish setup required, configured, connected, accepted event delivery and errors. Read-only connection checks do not send events. No personal lead information is sent during diagnostics.

Meta's official Node Business SDK source currently identifies API v26.0 (https://github.com/facebook/facebook-nodejs-business-sdk/blob/main/src/api.js). The two server delivery paths and the Facebook SDK version were updated from v18.0. Tokens use Authorization headers instead of query strings or public responses. Only a positive `events_received` acknowledgement records delivery; no invented event total or test conversion is generated. Connection/delivery evidence is scoped to the current credential fingerprint, and changing credentials invalidates prior evidence. Database errors display status unavailable rather than false inactivity.

The secret remains server-side. A valid website-dataset token must be saved by the owner to enable server delivery. Settings includes a save action near the token and instructions; the connection check verifies access after saving. Actual conversion event delivery is confirmed when Meta accepts a consented real website event. No fake leads or fabricated purchases were submitted to Meta.

## Release checks

13 focused unit tests passed. The production build and local authenticated HTTP checks passed. Focused lint passed for the new components and helpers. Final server-build and live checks will be recorded after deployment.
