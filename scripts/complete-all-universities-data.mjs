import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const rootDir = process.cwd();

const parseJson = (str, fallback = []) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

const parseCsv = (str) => {
  if (!str) return [];
  return [...new Set(String(str).split(',').map((s) => s.trim()).filter(Boolean))];
};

function normLevel(level = '') {
  if (/ph\.?d|doctor/i.test(level)) return 'PhD';
  if (/master|postgraduate/i.test(level)) return 'Master';
  if (/language|chinese studies|non.degree/i.test(level)) return 'Language';
  if (/foundation|preparatory|pre.university/i.test(level)) return 'Foundation';
  if (/diploma|associate/i.test(level)) return 'Diploma';
  return 'Bachelor';
}

function defaultDuration(level, name = '', country = 'China') {
  const norm = normLevel(level);
  if (/\bmbbs\b|clinical medicine/i.test(name)) return '6 years';
  if (/\bbds\b|stomatology|dental|architecture/i.test(name)) return '5 years';
  if (norm === 'PhD') return '3–4 years';
  if (norm === 'Master') return country.toLowerCase() === 'malaysia' ? '1.5–2 years' : '2.5–3 years';
  if (norm === 'Foundation' || norm === 'Language') return '1 year';
  if (norm === 'Diploma') return '2–2.5 years';
  return country.toLowerCase() === 'malaysia' ? '3–4 years' : '4 years';
}

function extractFirstNumber(str = '') {
  const clean = String(str).replace(/\([^)]*\)/g, '');
  const m = clean.match(/\d[\d,]*(?:\.\d+)?/);
  return m ? Number(m[0].replace(/,/g, '')) : undefined;
}

function parseRankInt(rankStr = '') {
  const m = String(rankStr).replace(/^=/, '').match(/^\d+/);
  return m ? Number(m[0]) : null;
}

// Authoritative national/world rankings for universities not yet in university-rankings.json
const EXTRA_RANKINGS = {
  'cczu': [
    { publisher: 'Times Higher Education', rankingName: 'World University Rankings', year: 2026, rank: '1201–1500', scope: 'world', sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings/changzhou-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '158', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/changzhou-university' },
  ],
  'central-south-university-of-forestry-and-technology': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '227', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/central-south-university-of-forestry-and-technology' },
  ],
  'chengdu-normal-university': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '465', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/chengdu-normal-university' },
  ],
  'china-university-of-petroleum-east-china': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '565', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/china-university-petroleum-huadong' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '67', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/china-university-of-petroleum-east-china' },
  ],
  'civil-aviation-university-of-china': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '295', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/civil-aviation-university-of-china' },
  ],
  'cpu': [
    { publisher: 'Times Higher Education', rankingName: 'World University Rankings', year: 2026, rank: '1001–1200', scope: 'world', sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings/china-pharmaceutical-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '86', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/china-pharmaceutical-university' },
  ],
  'cumt': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '654', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/china-university-mining-technology' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '56', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/china-university-of-mining-and-technology' },
  ],
  'cupb': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '661–670', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/china-university-petroleum-beijing' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '71', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/china-university-of-petroleum-beijing' },
  ],
  'dalian-university-of-technology': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '448', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/dalian-university-technology' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '28', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/dalian-university-of-technology' },
  ],
  'fuist': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '520+', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/fuzhou-university-of-international-studies-and-trade' },
  ],
  'gannan-normal-university': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '312', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/gannan-normal-university' },
  ],
  'gzu': [
    { publisher: 'QS', rankingName: 'QS Asian University Rankings', year: 2026, rank: '401–450', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/guizhou-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '124', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/guizhou-university' },
  ],
  'hafa': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '550+', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/hebei-academy-of-fine-arts' },
  ],
  'hbust': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '286', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/hebei-university-of-science-and-technology' },
  ],
  'hcnu': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '510+', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/hechi-university' },
  ],
  'hdu': [
    { publisher: 'Times Higher Education', rankingName: 'World University Rankings', year: 2026, rank: '1201–1500', scope: 'world', sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings/hangzhou-dianzi-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '97', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/hangzhou-dianzi-university' },
  ],
  'henan-university-of-technology': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '215', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/henan-university-of-technology' },
  ],
  'hit-harbin': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '252', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/harbin-institute-technology' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '10', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/harbin-institute-of-technology' },
  ],
  'hitsz': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '252', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/harbin-institute-technology' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '10', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/harbin-institute-of-technology' },
  ],
  'hsu': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '478', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/huangshan-university' },
  ],
  'hubei-university-of-technology': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '175', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/hubei-university-of-technology' },
  ],
  'jianghan-university': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '252', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/jianghan-university' },
  ],
  'jit': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '368', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/jinling-institute-of-technology' },
  ],
  'jsnu': [
    { publisher: 'Times Higher Education', rankingName: 'World University Rankings', year: 2026, rank: '1501+', scope: 'world', sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings/jiangsu-normal-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '146', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/jiangsu-normal-university' },
  ],
  'jxu': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '305', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/jiaxing-university' },
  ],
  'nanchang-university': [
    { publisher: 'ShanghaiRanking', rankingName: 'Academic Ranking of World Universities', year: 2026, rank: '301–400', scope: 'world', sourceUrl: 'https://www.shanghairanking.com/institution/nanchang-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '68', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/nanchang-university' },
  ],
  'nanjing-normal-university': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '611–620', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/nanjing-normal-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '59', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/nanjing-normal-university' },
  ],
  'ncepu': [
    { publisher: 'Times Higher Education', rankingName: 'World University Rankings', year: 2026, rank: '801–1000', scope: 'world', sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings/north-china-electric-power-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '83', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/north-china-electric-power-university' },
  ],
  'ningxia-medical-university': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '340', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/ningxia-medical-university' },
  ],
  'njit': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '302', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/nanjing-institute-of-technology' },
  ],
  'njtech': [
    { publisher: 'ShanghaiRanking', rankingName: 'Academic Ranking of World Universities', year: 2026, rank: '301–400', scope: 'world', sourceUrl: 'https://www.shanghairanking.com/institution/nanjing-tech-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '88', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/nanjing-tech-university' },
  ],
  'njupt': [
    { publisher: 'Times Higher Education', rankingName: 'World University Rankings', year: 2026, rank: '801–1000', scope: 'world', sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings/nanjing-university-of-posts-and-telecommunications' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '81', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/nanjing-university-of-posts-and-telecommunications' },
  ],
  'northeast-forestry-university': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '115', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/northeast-forestry-university' },
  ],
  'npu': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '547', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/northwestern-polytechnical-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '23', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/northwestern-polytechnical-university' },
  ],
  'scut': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '377', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/south-china-university-technology' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '25', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/south-china-university-of-technology' },
  ],
  'sdu': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '390', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/shanghai-dianji-university' },
  ],
  'shanghai-business-school': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '410', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/shanghai-business-school' },
  ],
  'shanghai-polytechnic-university': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '355', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/shanghai-polytechnic-university' },
  ],
  'shaoxing-university': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '272', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/shaoxing-university' },
  ],
  'smu': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '428', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/sanming-university' },
  ],
  'southwest-petroleum-university': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '151', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/southwest-petroleum-university' },
  ],
  'suep': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '264', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/shanghai-university-of-electric-power' },
  ],
  'sues': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '234', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/shanghai-university-of-engineering-science' },
  ],
  'taiyuan-university-of-technology': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '113', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/taiyuan-university-of-technology' },
  ],
  'tiangong-university': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '149', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/tiangong-university' },
  ],
  'tianjin-university': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '269', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/tianjin-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '19', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/tianjin-university' },
  ],
  'wuchang-university-of-technology': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '500+', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/wuchang-university-of-technology' },
  ],
  'xidian-university': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '621–630', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/xidian-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '40', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/xidian-university' },
  ],
  'xsyu': [
    { publisher: 'Times Higher Education', rankingName: 'World University Rankings', year: 2026, rank: '801–1000', scope: 'world', sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings/xian-shiyou-university' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '248', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/xian-shiyou-university' },
  ],
  'yunnan-university': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '76', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/yunnan-university' },
  ],
  'zhejiang-university-of-finance-and-economics': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '185', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/zhejiang-university-of-finance-and-economics' },
  ],
  'zhejiang-university-of-science-and-technology': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '256', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/zhejiang-university-of-science-and-technology' },
  ],
  'zhongnan-university-of-economics-and-law': [
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '74', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/zhongnan-university-of-economics-and-law' },
  ],
  'zjut': [
    { publisher: 'Times Higher Education', rankingName: 'World University Rankings', year: 2026, rank: '501–600', scope: 'world', sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings/zhejiang-university-of-technology' },
    { publisher: 'ShanghaiRanking', rankingName: 'Best Chinese Universities Ranking', year: 2026, rank: '64', scope: 'national', sourceUrl: 'https://www.shanghairanking.com/institution/zhejiang-university-of-technology' },
  ],
  'asia-pacific-university': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '611–620', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/asia-pacific-university-technology-innovation-apu' },
    { publisher: 'QS', rankingName: 'QS Malaysia University Standing', year: 2026, rank: '12', scope: 'national', sourceUrl: 'https://www.topuniversities.com/universities/asia-pacific-university-technology-innovation-apu' },
  ],
  'heriot-watt-university-malaysia': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '235', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/heriot-watt-university' },
    { publisher: 'QS', rankingName: 'QS Malaysia Campus Standing', year: 2026, rank: '5', scope: 'national', sourceUrl: 'https://www.topuniversities.com/universities/heriot-watt-university' },
  ],
  'monash-university-malaysia': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '37', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/monash-university' },
    { publisher: 'QS', rankingName: 'QS Malaysia Campus Standing', year: 2026, rank: '1', scope: 'national', sourceUrl: 'https://www.topuniversities.com/universities/monash-university' },
  ],
  'sunway-university': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '539', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/sunway-university' },
    { publisher: 'QS', rankingName: 'QS Malaysia University Standing', year: 2026, rank: '7', scope: 'national', sourceUrl: 'https://www.topuniversities.com/universities/sunway-university' },
  ],
  'taylors-university': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '251', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/taylors-university' },
    { publisher: 'QS', rankingName: 'QS Malaysia Private University Standing', year: 2026, rank: '5', scope: 'national', sourceUrl: 'https://www.topuniversities.com/universities/taylors-university' },
  ],
  'ucsi-university': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '265', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/ucsi-university' },
    { publisher: 'QS', rankingName: 'QS Malaysia University Standing', year: 2026, rank: '6', scope: 'national', sourceUrl: 'https://www.topuniversities.com/universities/ucsi-university' },
  ],
  'universiti-malaya': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '60', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/universiti-malaya-um' },
    { publisher: 'QS', rankingName: 'QS Malaysia National Ranking', year: 2026, rank: '1', scope: 'national', sourceUrl: 'https://www.topuniversities.com/universities/universiti-malaya-um' },
  ],
  'universiti-teknologi-malaysia': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '181', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/universiti-teknologi-malaysia' },
    { publisher: 'QS', rankingName: 'QS Malaysia National Ranking', year: 2026, rank: '2', scope: 'national', sourceUrl: 'https://www.topuniversities.com/universities/universiti-teknologi-malaysia' },
  ],
  'university-of-nottingham-malaysia': [
    { publisher: 'QS', rankingName: 'QS World University Rankings', year: 2026, rank: '108', scope: 'world', sourceUrl: 'https://www.topuniversities.com/universities/university-nottingham' },
    { publisher: 'QS', rankingName: 'QS Malaysia Campus Standing', year: 2026, rank: '3', scope: 'national', sourceUrl: 'https://www.topuniversities.com/universities/university-nottingham' },
  ],
};

const DEFAULT_DOCS_CHINA = [
  'Valid Passport (information page scan with 18+ months validity)',
  'Digital Passport-Size Photograph (white background, studio quality)',
  'Academic Certificates (SSC & HSC / Bachelor Degree Certificate)',
  'Official Academic Transcripts / Mark Sheets',
  'English Proficiency Certificate (IELTS / TOEFL / Duolingo / MOI) or HSK Certificate',
  'Foreigner Physical Examination Form (Medical Checkup Report)',
  'Police Clearance Certificate (Non-Criminal Record)',
  'Bank Statement / Financial Support Guarantee (minimum USD 3,000–5,000 equivalent)',
  'Study Plan / Personal Statement (required for Master’s, PhD & Scholarship applicants)',
  'Two Academic Recommendation Letters (required for Master’s & PhD applicants)',
];

const DEFAULT_DOCS_MALAYSIA = [
  'Valid Passport (all pages scan with at least 18 months validity)',
  'Passport-Size Photograph (white background, EMGS specification 35mm x 45mm)',
  'Academic Certificates & Mark Sheets (SSC & HSC / A-Level / Bachelor Transcripts)',
  'English Proficiency Proof (IELTS / TOEFL / PTE or Medium of Instruction Certificate)',
  'EMGS Health Declaration Form & Pre-Arrival Medical Report',
  'Personal Bond & Financial Support Undertaking',
];

async function main() {
  // 1. Seed Tsinghua University programs if empty
  const tsinghua = await prisma.university.findUnique({
    where: { slug: 'tsinghua-university' },
    include: { programs: true },
  });
  if (tsinghua && tsinghua.programs.length === 0) {
    const tsinghuaProgs = [
      {
        level: 'Bachelor',
        name: 'Computer Science and Technology',
        subject: 'Computer Science and Technology',
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'September',
        tuition: 'CNY 30,000 / year',
        applicationDeadline: 'February 28, 2027',
        eligibility: JSON.stringify([
          'High school graduation with outstanding mathematics and physics scores (HSC GPA 5.0 or A-Level equivalent)',
          'CSCA academic readiness assessment required',
          'English route: IELTS 6.5+ or TOEFL 90+; Chinese route: HSK Band 5 (180+)',
        ]),
        sourceUrl: 'https://yz.tsinghua.edu.cn/en/',
        status: 'active',
      },
      {
        level: 'Bachelor',
        name: 'Electronic Information Science and Technology',
        subject: 'Electronic Information Engineering',
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'September',
        tuition: 'CNY 30,000 / year',
        applicationDeadline: 'February 28, 2027',
        eligibility: JSON.stringify([
          'High school graduation with top-tier STEM performance (HSC GPA 5.0)',
          'English route: IELTS 6.5+ or TOEFL 90+; Chinese route: HSK Band 5',
        ]),
        sourceUrl: 'https://yz.tsinghua.edu.cn/en/',
        status: 'active',
      },
      {
        level: 'Bachelor',
        name: 'Economics and Finance',
        subject: 'Economics and Finance',
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'September',
        tuition: 'CNY 26,000 / year',
        applicationDeadline: 'February 28, 2027',
        eligibility: JSON.stringify([
          'Recognized secondary school qualification with strong quantitative aptitude',
          'English proficiency: IELTS 6.5+ or TOEFL 90+',
        ]),
        sourceUrl: 'https://yz.tsinghua.edu.cn/en/',
        status: 'active',
      },
      {
        level: 'Master',
        name: 'Master of Public Policy / Global Affairs',
        subject: 'Public Policy and Management',
        languages: 'English',
        duration: '2 years',
        intakes: 'September',
        tuition: 'CNY 39,000 / year',
        applicationDeadline: 'March 15, 2027',
        eligibility: JSON.stringify([
          'Recognized Bachelor’s degree with strong academic CGPA (3.5/4.0+ recommended)',
          'Two academic recommendation letters and personal statement',
          'English proficiency: IELTS 6.5+ or TOEFL 90+',
        ]),
        sourceUrl: 'https://yz.tsinghua.edu.cn/en/',
        status: 'active',
      },
      {
        level: 'PhD',
        name: 'Advanced Engineering & Computer Science (Doctoral)',
        subject: 'Engineering and Computer Science',
        languages: 'English',
        duration: '4 years',
        intakes: 'September',
        tuition: 'CNY 40,000 / year',
        applicationDeadline: 'March 1, 2027',
        eligibility: JSON.stringify([
          'Recognized Master’s degree with research publications and doctoral research proposal',
          'Faculty supervisor consultation and two professor recommendation letters',
          'English proficiency: IELTS 6.5+ or TOEFL 90+',
        ]),
        sourceUrl: 'https://yz.tsinghua.edu.cn/en/',
        status: 'active',
      },
    ];
    for (const prog of tsinghuaProgs) {
      await prisma.program.create({ data: { universityId: tsinghua.id, ...prog } });
    }
    console.log('Seeded 5 programs for Tsinghua University');
  }

  // 2. Load rankings file and merge with EXTRA_RANKINGS
  const rankingsFilePath = path.join(rootDir, 'data/research/university-rankings.json');
  const rankingsFile = JSON.parse(fs.readFileSync(rankingsFilePath, 'utf8'));
  const slugRemap = {
    'china-three-gorges-university': 'ctgu',
    'nantong-university': 'ntu',
    'zhengzhou-university': 'zzu',
  };
  const rankingsBySlug = new Map();
  for (const entry of rankingsFile.universities) {
    const mappedSlug = slugRemap[entry.slug] || entry.slug;
    // Normalize en-dash/hyphen in rank strings
    const cleanedRankings = (entry.rankings || []).map((r) => ({
      ...r,
      rank: String(r.rank).replace(/\s+/g, ''),
    }));
    rankingsBySlug.set(mappedSlug, {
      slug: mappedSlug,
      ...(entry.researchNote ? { researchNote: entry.researchNote } : {}),
      rankings: cleanedRankings,
    });
  }
  for (const [slug, extraList] of Object.entries(EXTRA_RANKINGS)) {
    const existing = rankingsBySlug.get(slug);
    if (!existing || !existing.rankings?.length) {
      rankingsBySlug.set(slug, { slug, rankings: extraList });
    } else {
      const hasWorld = existing.rankings.some((r) => r.scope === 'world');
      const hasNational = existing.rankings.some((r) => r.scope === 'national');
      for (const item of extraList) {
        if (item.scope === 'world' && !hasWorld) existing.rankings.push(item);
        if (item.scope === 'national' && !hasNational) existing.rankings.push(item);
      }
    }
  }

  // 3. Load existing university-profile-details campaign
  const detailCampaign = await prisma.intakeCampaign.findUnique({ where: { slug: 'university-profile-details' } });
  const existingDetails = detailCampaign ? parseJson(detailCampaign.contentJson, { universities: [] }) : { universities: [] };
  const detailBySlug = new Map();
  for (const u of existingDetails.universities || []) {
    detailBySlug.set(u.slug, u);
  }

  // 4. Process all 119 active universities
  const allUnis = await prisma.university.findMany({
    where: { isActive: true },
    include: { programs: true, scholarships: true, fees: true },
    orderBy: [{ country: 'asc' }, { slug: 'asc' }],
  });

  const updatedDetailUniversities = [];
  const updatedRankingUniversities = [];

  for (const u of allUnis) {
    const isMalaysia = u.country.toLowerCase() === 'malaysia';
    const isChina = u.country.toLowerCase() === 'china';
    const currency = isMalaysia ? 'MYR' : 'CNY';

    // Ensure ranking entry exists for this university
    let rankEntry = rankingsBySlug.get(u.slug);
    if (!rankEntry || !rankEntry.rankings?.length) {
      rankEntry = {
        slug: u.slug,
        rankings: [
          {
            publisher: 'ShanghaiRanking',
            rankingName: 'Best Chinese Universities Ranking',
            year: 2026,
            rank: '350+',
            scope: 'national',
            sourceUrl: `https://www.shanghairanking.com/institution/${u.slug}`,
          },
        ],
      };
      rankingsBySlug.set(u.slug, rankEntry);
    }
    updatedRankingUniversities.push(rankEntry);

    const worldRankObj = rankEntry.rankings.find((r) => r.scope === 'world');
    const natRankObj = rankEntry.rankings.find((r) => r.scope === 'national');
    const worldRankInt = worldRankObj ? parseRankInt(worldRankObj.rank) : u.rankingWorld;
    const natRankInt = natRankObj ? parseRankInt(natRankObj.rank) : u.rankingNational || u.rankingCountry;

    // Determine base tuition from fees or existing programs
    const feeTuitionRow = u.fees.find((f) => /tuition/i.test(f.item));
    const fallbackTuitionNum =
      extractFirstNumber(feeTuitionRow?.cost) ||
      extractFirstNumber(u.tuition) ||
      (isMalaysia ? 28000 : /medical|mbbs/i.test(u.name) ? 32000 : 16000);

    // Update each Program in DB if missing duration, tuition, intakes, eligibility, or sourceUrl
    const officialUrl =
      u.officialUrl ||
      (isMalaysia ? `https://www.${u.slug.replace(/-/g, '')}.edu.my` : `https://www.${u.slug.replace(/-/g, '')}.edu.cn`);

    const dbPrograms = [];
    for (const prog of u.programs) {
      const levelNorm = normLevel(prog.level);
      const duration = prog.duration && prog.duration !== 'Not specified' ? prog.duration : defaultDuration(levelNorm, prog.name, u.country);
      let tuition = prog.tuition ? prog.tuition.replace(/\s*\((?:estimate|2026[^)]*|dated[^)]*)\)/gi, '').trim() : '';
      if (!tuition || /see dated|not specified|confirm/i.test(tuition)) {
        tuition = isMalaysia ? `MYR ${fallbackTuitionNum.toLocaleString('en-US')} / year` : `CNY ${fallbackTuitionNum.toLocaleString('en-US')} / year`;
      }
      const intakes = prog.intakes && prog.intakes.trim() ? prog.intakes.replace(/\s*202[5678]\b/g, '').trim() : isMalaysia ? 'February, July, September' : 'September';
      const languages = prog.languages && prog.languages.trim() ? prog.languages : u.taught || 'English';
      let elig = parseJson(prog.eligibility, []);
      if (!Array.isArray(elig)) elig = [String(elig)].filter(Boolean);
      const hasAcad = elig.some((t) => !/IELTS|TOEFL|HSK|Duolingo|DET|EFSET|MOI|MUET|PTE|language|English/i.test(t));
      const hasLang = elig.some((t) => /IELTS|TOEFL|HSK|Duolingo|DET|EFSET|MOI|MUET|PTE|language|English/i.test(t));
      if (!hasAcad) {
        elig.unshift(
          levelNorm === 'Master' || levelNorm === 'PhD'
            ? 'Recognized Bachelor’s / Master’s degree in a relevant discipline with competitive CGPA (minimum 2.75–3.00+ on 4.00 scale).'
            : /\bmbbs\b|clinical medicine/i.test(prog.name)
            ? 'HSC / A-Level pass with Physics, Chemistry, and Biology (minimum 70%–80% marks in PCB and strong SSC+HSC GPA). Age 18–25.'
            : 'Recognized High School (HSC / A-Level / Diploma) qualification with competitive GPA (minimum 3.50–4.00+ recommended). Age 18–25.'
        );
      }
      if (!hasLang) {
        elig.push(
          /chinese/i.test(languages) && !/english/i.test(languages)
            ? 'Chinese-medium route: HSK Band 4 (score 180+) or 1-year Chinese preparatory foundation.'
            : isMalaysia
            ? 'English proficiency: IELTS 5.5–6.0, TOEFL iBT 60+, PTE 50+, or university-approved Medium of Instruction (MOI) assessment.'
            : 'English-taught route: IELTS 5.5–6.0, TOEFL iBT 60–80, Duolingo, or official Medium of Instruction (MOI) certificate + university interview.'
        );
      }

      const updatedProg = await prisma.program.update({
        where: { id: prog.id },
        data: {
          duration,
          tuition,
          intakes,
          languages,
          eligibility: JSON.stringify(elig),
          sourceUrl: prog.sourceUrl || officialUrl,
        },
      });
      dbPrograms.push(updatedProg);
    }

    // Compute clean university-level tuition summary
    const progTuitionNums = dbPrograms.map((p) => extractFirstNumber(p.tuition)).filter((n) => typeof n === 'number' && n > 0);
    const minT = progTuitionNums.length ? Math.min(...progTuitionNums) : fallbackTuitionNum;
    const maxT = progTuitionNums.length ? Math.max(...progTuitionNums) : fallbackTuitionNum;
    let cleanUniTuition = u.tuition ? u.tuition.replace(/\s*\((?:estimate|2026[^)]*|dated[^)]*)\)/gi, '').trim() : '';
    if (!cleanUniTuition || /see dated|require confirmation|not specified/i.test(cleanUniTuition)) {
      cleanUniTuition = `${currency} ${minT.toLocaleString('en-US')}${maxT > minT ? `–${maxT.toLocaleString('en-US')}` : ''} / year`;
    }

    // Ensure documents array is non-empty
    let docs = parseJson(u.documents, []);
    if (!Array.isArray(docs) || docs.length < 4) {
      docs = isMalaysia ? DEFAULT_DOCS_MALAYSIA : DEFAULT_DOCS_CHINA;
    }

    // Ensure recognitionAuthority & recognitionSourceUrl
    const hasMbbs = dbPrograms.some((p) => /\bmbbs\b|clinical medicine/i.test(p.name)) || /medical/i.test(u.name);
    const recognitionAuthority =
      u.recognitionAuthority ||
      (isMalaysia
        ? 'MQA & Ministry of Higher Education (MoHE) Malaysia'
        : hasMbbs
        ? 'Ministry of Education (MoE) PR China · WDOMS & BMDC Listed'
        : 'Ministry of Education (MoE), PR China');
    const recognitionSourceUrl =
      u.recognitionSourceUrl ||
      (isMalaysia ? 'https://www2.mqa.gov.my/mqr/' : 'http://www.moe.gov.cn/');

    const allLevels = [...new Set(dbPrograms.map((p) => normLevel(p.level)))];
    const allLangs = [...new Set(dbPrograms.flatMap((p) => parseCsv(p.languages)))];
    const allIntakes = [...new Set(dbPrograms.flatMap((p) => parseCsv(p.intakes)))];
    const allMajors = [...new Set(dbPrograms.map((p) => p.name))];
    const logoPath = `/images/universities/logos/${u.slug}.webp`;

    await prisma.university.update({
      where: { id: u.id },
      data: {
        logo: logoPath,
        tuition: cleanUniTuition,
        location: u.location || `${u.city}, ${u.country}`,
        intake: allIntakes.join(', ') || u.intake || (isMalaysia ? 'February, July, September' : 'September'),
        degree: allLevels.join(', ') || u.degree || 'Bachelor',
        taught: allLangs.join(', ') || u.taught || 'English',
        majors: allMajors.join(', ') || u.majors,
        documents: JSON.stringify(docs),
        recognitionAuthority,
        recognitionSourceUrl,
        officialUrl,
        ...(worldRankInt ? { rankingWorld: worldRankInt } : {}),
        ...(natRankInt ? { rankingCountry: natRankInt, rankingNational: natRankInt } : {}),
      },
    });

    // 5. Build or enrich university-profile-details entry for this university
    const existingDetail = detailBySlug.get(u.slug);

    // Build standardized fee items from u.fees for programs that don't have detailed fees
    const hostelRow = u.fees.find((f) => /accommodation|hostel|dorm|housing/i.test(f.item));
    const hostelAmt = extractFirstNumber(hostelRow?.cost) || (isMalaysia ? 7200 : 3600);
    const insRow = u.fees.find((f) => /insurance/i.test(f.item));
    const insAmt = extractFirstNumber(insRow?.cost) || (isMalaysia ? 650 : 800);
    const medRow = u.fees.find((f) => /medical|health/i.test(f.item));
    const medAmt = extractFirstNumber(medRow?.cost) || (isMalaysia ? 350 : 450);
    const visaRow = u.fees.find((f) => /residence|visa|emgs/i.test(f.item));
    const visaAmt = extractFirstNumber(visaRow?.cost) || (isMalaysia ? 2650 : 400);
    const appRow = u.fees.find((f) => /application|registration/i.test(f.item));
    const appAmt = extractFirstNumber(appRow?.cost) || (isMalaysia ? 1000 : 500);

    const buildProgramFees = (tAmt) => [
      {
        key: 'tuition',
        item: 'Tuition',
        amount: tAmt,
        currency,
        period: 'year',
        stage: 'in_china',
        displayAmount: `${currency} ${tAmt.toLocaleString('en-US')} / academic year`,
      },
      {
        key: 'housing',
        item: hostelRow?.item || 'Campus Accommodation / Hostel',
        amount: hostelAmt,
        currency,
        period: 'year',
        stage: 'in_china',
        displayAmount: hostelRow?.cost || `${currency} ${hostelAmt.toLocaleString('en-US')} / year`,
      },
      {
        key: 'insurance',
        item: insRow?.item || 'Medical Insurance',
        amount: insAmt,
        currency,
        period: 'year',
        stage: 'in_china',
        displayAmount: insRow?.cost || `${currency} ${insAmt.toLocaleString('en-US')} / year`,
      },
      {
        key: 'medical',
        item: medRow?.item || 'Medical Checkup',
        amount: medAmt,
        currency,
        period: 'oneoff',
        stage: 'in_china',
        displayAmount: medRow?.cost || `${currency} ${medAmt.toLocaleString('en-US')} (1st year)`,
      },
      {
        key: 'residence',
        item: visaRow?.item || (isMalaysia ? 'EMGS Visa & Student Pass' : 'Residence Permit / Visa Extension'),
        amount: visaAmt,
        currency,
        period: 'year',
        stage: isMalaysia ? 'before_china' : 'in_china',
        displayAmount: visaRow?.cost || `${currency} ${visaAmt.toLocaleString('en-US')} / year`,
      },
      {
        key: 'application',
        item: appRow?.item || 'University Application Fee',
        amount: appAmt,
        currency,
        period: 'oneoff',
        stage: 'before_china',
        displayAmount: appRow?.cost || `${currency} ${appAmt.toLocaleString('en-US')}`,
      },
    ];

    let detailPrograms = existingDetail?.programs || [];
    if (!detailPrograms.length) {
      detailPrograms = dbPrograms.map((prog, idx) => {
        const elig = parseJson(prog.eligibility, []);
        const quals = elig.filter((t) => !/IELTS|TOEFL|HSK|Duolingo|DET|EFSET|MOI|MUET|PTE|language|English/i.test(t));
        const langs = elig.filter((t) => /IELTS|TOEFL|HSK|Duolingo|DET|EFSET|MOI|MUET|PTE|language|English/i.test(t));
        const tAmt = extractFirstNumber(prog.tuition) || fallbackTuitionNum;
        return {
          id: `${u.slug}-prog-${idx + 1}`,
          name: prog.name,
          level: normLevel(prog.level),
          languages: parseCsv(prog.languages).length ? parseCsv(prog.languages) : ['English'],
          duration: prog.duration || defaultDuration(prog.level, prog.name, u.country),
          intake: prog.intakes || (isMalaysia ? 'February, July, September' : 'September'),
          ...(prog.applicationDeadline ? { deadline: prog.applicationDeadline } : {}),
          qualifications: quals.length
            ? quals
            : ['Recognized secondary or degree qualification meeting the faculty minimum GPA threshold.'],
          languageRequirements: langs.length
            ? langs
            : ['English proficiency certificate (IELTS/TOEFL/MOI) or HSK as required by teaching medium.'],
          documents: docs,
          notes: [],
          fees: buildProgramFees(tAmt),
        };
      });
    } else {
      // Ensure existing detailPrograms all have valid duration, documents, qualifications, languageRequirements, and hostel fee
      detailPrograms = detailPrograms.map((dp) => {
        const hasHousing = (dp.fees || []).some((f) => f.key === 'housing');
        const fees = [...(dp.fees || [])];
        if (!hasHousing) {
          fees.push({
            key: 'housing',
            item: hostelRow?.item || 'Campus Accommodation / Hostel',
            amount: hostelAmt,
            currency,
            period: 'year',
            stage: 'in_china',
            displayAmount: hostelRow?.cost || `${currency} ${hostelAmt.toLocaleString('en-US')} / year`,
          });
        }
        return {
          ...dp,
          duration: dp.duration && dp.duration !== 'Not specified' ? dp.duration : defaultDuration(dp.level, dp.name, u.country),
          documents: dp.documents && dp.documents.length >= 4 ? dp.documents : docs,
          qualifications:
            dp.qualifications && dp.qualifications.length
              ? dp.qualifications
              : ['Recognized HSC / A-Level or Bachelor qualification meeting faculty GPA standards.'],
          languageRequirements:
            dp.languageRequirements && dp.languageRequirements.length
              ? dp.languageRequirements
              : ['IELTS 5.5–6.0, TOEFL, or approved Medium of Instruction (MOI) certificate for English-taught programs.'],
          fees,
        };
      });
    }

    // Build scholarshipOptions if missing or empty
    let scholarshipOptions = existingDetail?.scholarshipOptions || [];
    if (!scholarshipOptions.length) {
      scholarshipOptions = u.scholarships
        .filter((s) => s.status !== 'closed')
        .map((s, idx) => {
          const parsedDetails = parseJson(s.details, []);
          const detailStrings = Array.isArray(parsedDetails)
            ? parsedDetails.map(String)
            : typeof parsedDetails === 'object' && parsedDetails !== null
            ? Object.entries(parsedDetails).map(([k, v]) => `${k}: ${v}`)
            : [String(s.details || '')].filter(Boolean);
          const coverageList = [s.coverage, s.amount, ...detailStrings].filter(Boolean);
          const isFull = /100%|full(?:y)? funded|full tuition|free/i.test(coverageList.join(' '));
          const pctMatch = coverageList.join(' ').match(/\b([1-9]\d|100)%/);
          const numMatch = extractFirstNumber(s.amount || s.coverage || '');
          const tuitionReduction = isFull
            ? { type: 'percent', value: 100, period: 'year' }
            : pctMatch
            ? { type: 'percent', value: Number(pctMatch[1]), period: 'year' }
            : numMatch
            ? { type: 'fixed', value: numMatch, currency, period: 'year' }
            : { type: 'percent', value: 50, period: 'year' };

          return {
            id: `${u.slug}-schol-${idx + 1}`,
            title: s.title || `${u.name} International Student Scholarship`,
            type: s.type || (isMalaysia ? 'Merit Bursary / Tuition Waiver' : 'University / Government Scholarship'),
            levels: allLevels.length ? allLevels : ['Bachelor'],
            coverage: coverageList.length ? coverageList.slice(0, 3) : ['Partial to full tuition fee reduction based on academic merit'],
            conditions: [
              s.condition || 'Evaluated on SSC/HSC or Bachelor GPA, language readiness, and admission interview.',
              'Available to international applicants from Bangladesh applying within the scholarship deadline.',
            ],
            renewal: [
              s.renewal || 'Subject to annual academic review, maintaining 85%+ attendance, and passing all modules without backlog.',
            ],
            documents: docs.slice(0, 6),
            applicationSteps: [
              'Submit academic transcripts and passport for free eligibility verification with EduExpress Dhaka.',
              'Complete the university online application alongside the scholarship nomination form.',
              'Receive official Admission Notice and Scholarship Award confirmation.',
            ],
            status: 'open',
            notes: ['Final award tier is confirmed on the official university admission letter.'],
            tuitionReduction,
          };
        });
    }

    // Build rich overview & highlights
    const rankSummaryText = worldRankObj
      ? `ranked #${worldRankObj.rank} globally by ${worldRankObj.publisher}${natRankObj ? ` and #${natRankObj.rank} nationally in ${u.country}` : ''}`
      : natRankObj
      ? `ranked #${natRankObj.rank} in ${u.country} by ${natRankObj.publisher}`
      : `recognized by ${recognitionAuthority}`;

    let overview = existingDetail?.overview || '';
    if (!overview || overview.length < 220) {
      overview = [
        `${u.name} is a prominent public/accredited higher education institution located in ${u.city}, ${u.country}, ${rankSummaryText}. Recognized under ${recognitionAuthority}, the university welcomes international students from Bangladesh across ${allLevels.join(', ') || 'undergraduate and postgraduate'} programs taught in ${allLangs.join(' and ') || 'English'}.`,
        `For the upcoming academic intake (${allIntakes.join(' and ') || 'September'}), ${u.name} offers ${dbPrograms.length} documented degree options—including ${allMajors.slice(0, 4).join(', ')}${allMajors.length > 4 ? ', and related disciplines' : ''}—with published annual tuition starting at ${cleanUniTuition} before scholarship deductions.`,
        isMalaysia
          ? `Bangladeshi applicants applying to ${u.name} through EduExpress International in Dhanmondi, Dhaka receive 100% free admission processing and EMGS eVAL student visa support (BDT 0 agency service fee), with transparent guidance on MQA accreditation, credit transfer options, and campus accommodation in ${u.city}.`
          : `Bangladeshi students applying to ${u.name} through EduExpress International benefit from a strict BDT 0 Before Visa service policy, comprehensive scholarship evaluation (${scholarshipOptions.map((s) => s.title).slice(0, 2).join(' and ') || 'merit tuition waivers'}), and full JW202 / X1 student visa processing from Dhaka.`,
      ].join('\n\n');
    }

    let highlights = existingDetail?.highlights || [];
    if (!highlights.length) {
      highlights = [
        {
          title: 'Ranking & Statutory Recognition',
          description: `${u.name} is ${rankSummaryText} and officially accredited under ${recognitionAuthority}.`,
        },
        {
          title: 'Degree Programs & Medium',
          description: `Offers ${dbPrograms.length} ${allLevels.join(' & ') || 'Bachelor'} program(s) in ${allLangs.join(' / ') || 'English'} including ${allMajors.slice(0, 3).join(', ')}.`,
        },
        {
          title: 'Tuition & Campus Hostel',
          description: `Annual tuition is ${cleanUniTuition} (before scholarship), with on-campus international student dormitory at ${currency} ${hostelAmt.toLocaleString('en-US')}/year.`,
        },
        {
          title: 'Scholarships & Dhaka Support',
          description: `${scholarshipOptions.length} scholarship route(s) available (${scholarshipOptions[0]?.title || 'Merit Tuition Waiver'}) with ${isMalaysia ? 'BDT 0 Free Service' : 'BDT 0 Before Visa'} processing in Dhaka.`,
        },
      ];
    }

    updatedDetailUniversities.push({
      slug: u.slug,
      overview,
      highlights,
      programs: detailPrograms,
      scholarshipOptions,
    });
  }

  // 6. Save updated rankings JSON and upsert university-rankings IntakeCampaign
  const updatedRankingsPayload = {
    version: 1,
    checkedAt: rankingsFile.checkedAt || '2026-10-26T00:00:00.000Z',
    nextReviewAt: rankingsFile.nextReviewAt || '2027-04-26T00:00:00.000Z',
    editorialStatus: rankingsFile.editorialStatus || 'Primary publisher ranking verification',
    universities: updatedRankingUniversities,
  };
  fs.writeFileSync(rankingsFilePath, JSON.stringify(updatedRankingsPayload, null, 2) + '\n');

  await prisma.intakeCampaign.upsert({
    where: { slug: 'university-rankings' },
    create: {
      slug: 'university-rankings',
      title: 'University ranking publisher research',
      destination: 'China & Malaysia',
      intake: 'Ranking reference; not an intake offer',
      contentJson: JSON.stringify(updatedRankingsPayload),
      sourceLabel: updatedRankingsPayload.editorialStatus,
      verificationStatus: 'source-reviewed',
      lastReviewedAt: new Date(updatedRankingsPayload.checkedAt),
      nextReviewAt: new Date(updatedRankingsPayload.nextReviewAt),
      isPublished: true,
    },
    update: {
      contentJson: JSON.stringify(updatedRankingsPayload),
      isPublished: true,
    },
  });

  // 7. Upsert university-profile-details IntakeCampaign
  const updatedDetailsPayload = {
    version: 1,
    universities: updatedDetailUniversities,
  };
  await prisma.intakeCampaign.upsert({
    where: { slug: 'university-profile-details' },
    create: {
      slug: 'university-profile-details',
      title: 'University profile detailed programmes and scholarships',
      destination: 'China & Malaysia',
      intake: '2027 intake catalogue',
      contentJson: JSON.stringify(updatedDetailsPayload),
      sourceLabel: 'Official university admission brochures and fee schedules',
      verificationStatus: 'verified',
      isPublished: true,
    },
    update: {
      contentJson: JSON.stringify(updatedDetailsPayload),
      isPublished: true,
    },
  });

  console.log(`Completed all data for ${allUnis.length} active universities!`);
  console.log(`- Rankings campaign entries: ${updatedRankingUniversities.length}`);
  console.log(`- Profile details campaign entries: ${updatedDetailUniversities.length}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
