//平台代码
export const PLATFORM_CODE = 'P0101';


//角色CODE
export const ROLE_CODE_ROOT = 'root';
export const ROLE_CODE_MGR = 'mgr';
export const ROLE_CODE_BD = 'bd';
export const ROLE_CODE_IR = 'ir';

//本地token的key
export const TOKEN_KEY = 'tokenId';
export const REAL_NAME_KEY = 'realName';
export const ROLE_CODE_KEY = 'roleCode';

//接口code
export const NO_LOGIN = 'NO_LOGIN';
export const INVALID_TOKEN = 'INVALID_TOKEN';


export const ROUNDS = ['未知轮次', '未融资', '种子轮', '天使轮', 'Pre-A轮', 'A轮', 'A+轮', 'Pre-B轮', 'B轮', 'B+轮', 'C轮',
  'C+轮', 'D轮', 'E轮以后', '新三板', '新四板', 'Pre-IPO', '并购', '上市', '战略投资', '上市以后', '定增'];

export const INDUSTRY_LIST = ['环保', '机器人', '硬件', '化工', '材料', '消费生活', '光电', '汽车交通', '房产家居', '金融', 'VR·AR', '人工智能', '地产建筑',
  '旅游', '社交', '无人机', '能源矿产', '公共事业', '农业', '教育', '体育', '企业服务', '物流', '医疗健康', '工具', '生产制造', '电商', '文娱传媒',];

export const POSITION_LIST = ['分析师', '投资助理', '投资经理', '高级投资经理', '投资总监', '高级投资总监', 'VP', 'SVP', '助理合伙人', '合伙人(含MD/ED)',
  '管理合伙人', '总经理', '创始合伙人(含总裁/董事长)'];

export const INSTITUTION_NATURE_ARR = [{name: "VC", code: 0}, {name: "PE", code: 1}, {name: "VC+PE", code: 2}];
export const INSTITUTION_TYPE_ARR = [{name: "财务", code: 0}, {name: "战略", code: 1}, {name: "财务+战略", code: 2}];
export const INSTITUTION_STATUS_ARR = [{name: "活跃", code: 0}, {name: "一般", code: 1}, {name: "不活跃", code: 2}];
export const INVESTMENT_CASE_TYPE_ARR = [{code: 0, name: '跟投'}, {code: 1, name: '领投'}];
