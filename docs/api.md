# 养老金提取API简化方案

## 架构调整
```
[客户端]
  │
  ├─(GET) 获取流程配置
  ├─(POST) 提交表单数据
  │
[API Server] 
  ├─ 配置加载模块（JSON/YAML）
  ├─ 验证引擎
  └─ 轻量级状态管理（内存/cookie）
```

## 表单布局与元素定义

### 1. 布局结构
```typescript
interface PageLayout {
  type: "main-content";
  title: string;
  description?: string;
  backButton?: boolean;
  sections: Section[];
  actions: {
    next?: boolean;
    cancel?: boolean;
  };
}

interface Section {
  type: "section";
  title?: string;
  description?: string;
  rows: ContentRow[];
}

interface ContentRow {
  type: "row";
  leftColumn: FormElement;
  rightColumn?: RightColumnContent;  // 右列可以是表单元素、帮助信息或其他内容
  alignment?: "top" | "center" | "bottom";
}

// 右列内容类型
type RightColumnContent = 
  | FormElement 
  | HelpContent
  | string 
  | number;

interface HelpContent {
  type: "help";
  title: string;
  content: string;
  contactInfo?: {
    phone: string;
    hours: string;
  };
  style?: "card" | "inline";
}
```

### 2. 表单元素类型
```typescript
// 基础布局元素
interface Grid extends BaseFormElement {
  type: "grid";
  columns: number;
  gap?: string;
  children: FormElement[];
}

interface GridContainer extends BaseFormElement {
  type: "grid-container";
  maxWidth?: string;
  padding?: string;
  children: FormElement[];
}

// 基础文本元素
interface Heading extends BaseFormElement {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  align?: "left" | "center" | "right";
}

interface Paragraph extends BaseFormElement {
  type: "paragraph";
  text: string;
  size?: "small" | "medium" | "large";
  color?: string;
}

// 基础交互元素
interface ButtonGroup extends BaseFormElement {
  type: "button-group";
  align?: "left" | "center" | "right";
  spacing?: "none" | "small" | "medium" | "large";
  buttons: Button[];
}

interface Button extends BaseFormElement {
  type: "button";
  text: string;
  variant: "primary" | "secondary" | "text" | "link";
  size?: "small" | "medium" | "large";
  icon?: string;
  onClick?: string;  // 事件处理函数名
}

interface Notification extends BaseFormElement {
  type: "notification";
  title?: string;
  content: string;
  variant: "info" | "warning" | "error" | "success";
  dismissible?: boolean;
  icon?: string;
}

interface SelectInput extends BaseFormElement {
  type: "select";
  name: string;
  label?: string;
  placeholder?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  multiple?: boolean;
  searchable?: boolean;
}

interface ShowMore extends BaseFormElement {
  type: "show-more";
  summary: string;
  content: FormElement[];
  expandedByDefault?: boolean;
}

interface Card extends BaseFormElement {
  type: "card";
  title?: string;
  subtitle?: string;
  content: FormElement[];
  footer?: FormElement[];
  variant?: "default" | "outlined" | "elevated";
  selectable?: boolean;
  selected?: boolean;
}

// 基础消息类型
interface Message {
  type: "info" | "warning" | "error" | "success";
  content: string;
  icon?: string;
  style?: "card" | "inline" | "banner";
}

// 基础元素接口
interface BaseFormElement {
  type: string;
  id?: string;
  className?: string;
  style?: Record<string, string>;
  messages?: Message[];
  visible?: boolean;
  disabled?: boolean;
}

// 业务元素
interface RadioGroup extends BaseFormElement {
  type: "radio-group";
  name: string;
  options: Array<{
    value: string;
    label: string;
    messages?: Message[];
  }>;
  layout?: "horizontal" | "vertical";
}

interface AmountInput extends BaseFormElement {
  type: "amount-input";
  name: string;
  label?: string;
  prefix?: "£";
  max?: number;
  description?: string;
  validation?: {
    rules: ValidationRule[];
    messages?: Message[];
  };
}

interface InfoCard extends BaseFormElement {
  type: "info-card";
  style: "info" | "warning" | "success";
  content: string;
  icon?: string;
}

interface SummaryRow extends BaseFormElement {
  type: "summary-row";
  label: string;
  value: string | number;
  calculation?: string;
  messages?: Message[];
  style?: {
    label?: "bold" | "normal";
    value?: "bold" | "normal";
    divider?: boolean;
  };
}

interface Label extends BaseFormElement {
  type: "label";
  text: string;
  style?: "heading" | "normal" | "description";
}

interface OptionsGroup extends BaseFormElement {
  type: "options-group";
  options: Array<{
    title: string;
    description: string;
    selected?: boolean;
    messages?: Message[];
    style?: "default" | "highlighted" | "info";
  }>;
  layout: "cards";
}

// 更新FormElement类型
type FormElement = 
  | Grid
  | GridContainer
  | Heading
  | Paragraph
  | ButtonGroup
  | Button
  | Notification
  | SelectInput
  | ShowMore
  | Card
  | RadioGroup
  | AmountInput
  | InfoCard
  | SummaryRow
  | Label
  | OptionsGroup;
```

## 核心API设计

### 1. 动态表单接口
```markdown
GET /api/forms/{formId}
响应示例：
{
  "id": "tax-calculation-form",
  "layout": {
    "type": "main-content",
    "title": "Understand taxes on your withdrawal",
    "backButton": true,
    "sections": [
      {
        "title": "Withdrawal amount",
        "rows": [
          {
            "type": "row",
            "leftColumn": {
              "type": "label",
              "text": "How much of your pension pot do you want to withdraw?"
            },
            "rightColumn": {
              "type": "radio-group",
              "name": "withdrawalType",
              "layout": "horizontal",
              "options": [
                { "value": "all", "label": "All of it" },
                { "value": "part", "label": "Part of it" }
              ]
            }
          },
          {
            "type": "row",
            "alignment": "top",
            "leftColumn": {
              "type": "label",
              "text": "Need help?"
            },
            "rightColumn": {
              "type": "help",
              "title": "Need some help?",
              "content": "If there's something you want to ask us, just give us a call",
              "contactInfo": {
                "phone": "XXXX",
                "hours": "9am to 5pm, Monday to Friday"
              },
              "style": "card"
            }
          }
        ]
      }
    ],
    "actions": {
      "next": true,
      "cancel": true
    }
  }
}
```

### 2. 最终数据提交接口
```markdown
POST /api/submit
请求体：
{
  "flowId": "pension-withdrawal",
  "allStepsData": {              // 提交所有步骤的数据
    "tax-calculation": {
      "withdrawalType": "part",
      "withdrawalAmount": 35000,
      "withdrawalOption": "tax-free-plus-taxable"
    },
    "investment-choice": {
      // ... 其他步骤的数据
    }
  }
}

响应：
{
  "success": true,
  "reference": "PW-2024-001",    // 业务参考号
  "summary": {
    "totalWithdrawal": 35000,
    "taxFreeAmount": 25000,
    "taxableAmount": 10000,
    "taxPayable": 2952.67,
    "finalAmount": 32047.33
  }
}
```

### 3. 表单元数据接口
```markdown
GET /api/forms/{formId}/metadata
响应示例：
{
  "id": "tax-calculation-form",
  "layout": {
    "type": "main-content",
    "title": "Understand taxes on your withdrawal",
    "sections": [
      {
        "id": "withdrawal-amount",
        "title": "Withdrawal amount",
        "dataProvider": "account-info",  // 指定数据提供者
        "rows": [...]
      }
    ]
  }
}
```

### 4. 表单数据提供者接口
```markdown
GET /api/forms/data-providers
请求参数：
{
  "providers": ["account-info", "tax-rates"],
  "context": {
    "userId": "123",
    "accountId": "456"
  }
}

响应示例：
{
  "account-info": {
    "totalPension": 100000,
    "taxFreeAllowance": 25000,
    "withdrawalLimits": {
      "min": 1000,
      "max": 100000
    },
    "accountStatus": "active"
  },
  "tax-rates": {
    "basicRate": 0.20,
    "higherRate": 0.40,
    "personalAllowance": 12570
  }
}
```

### 5. 表单数据更新接口
```markdown
POST /api/forms/{formId}/sections/{sectionId}/refresh
请求体：
{
  "context": {
    "withdrawalAmount": 35000,
    "taxableIncome": 45000
  }
}

响应示例：
{
  "taxCalculation": {
    "taxFreeAmount": 25000,
    "taxableAmount": 10000,
    "taxPayable": 2952.67,
    "effectiveTaxRate": 0.20
  },
  "warnings": [
    {
      "type": "tax-band-change",
      "message": "This withdrawal may push you into a higher tax band"
    }
  ]
}
```

### 6. 表单验证接口
```markdown
POST /api/forms/{formId}/sections/{sectionId}/validate
请求体：
{
  "data": {
    "withdrawalAmount": 35000
  },
  "context": {
    "accountInfo": {
      "totalPension": 100000,
      "taxFreeAllowance": 25000
    }
  }
}

响应示例：
{
  "valid": true,
  "calculations": {
    "taxFreeAmount": 25000,
    "taxableAmount": 10000
  },
  "warnings": [
    {
      "field": "withdrawalAmount",
      "type": "tax-implication",
      "message": "This amount exceeds your tax-free allowance"
    }
  ]
}
```

## 客户端状态管理

### 1. 数据结构
```typescript
interface FlowState {
  flowId: string;
  totalPension: number;
  steps: {
    [stepId: string]: {
      status: "not_started" | "in_progress" | "completed" | "error";
      data: any;
      lastModified?: string;
      validationErrors?: ValidationError[];
    };
  };
  currentStep: string;
  lastSaved?: string;        // 最后保存时间戳
}

// 客户端存储键值
const STORAGE_KEYS = {
  FLOW_STATE: "pension-withdrawal-flow-state"
};
```

### 2. 状态管理工具
```typescript
class FlowStateManager {
  // 初始化流程
  static initialize(totalPension: number): void {
    const initialState: FlowState = {
      flowId: "pension-withdrawal",
      totalPension,
      steps: {},
      currentStep: "tax-calculation"
    };
    this.saveState(initialState);
  }

  // 保存步骤数据
  static saveStepData(stepId: string, data: any): void {
    const state = this.getState();
    state.steps[stepId] = {
      status: "completed",
      data: data,
      lastModified: new Date().toISOString()
    };
    state.lastSaved = new Date().toISOString();
    this.saveState(state);
  }

  // 获取当前状态
  static getState(): FlowState {
    const stored = sessionStorage.getItem(STORAGE_KEYS.FLOW_STATE);
    return stored ? JSON.parse(stored) : null;
  }

  // 保存状态
  private static saveState(state: FlowState): void {
    sessionStorage.setItem(STORAGE_KEYS.FLOW_STATE, JSON.stringify(state));
  }

  // 验证步骤数据
  static async validateStep(stepId: string): Promise<ValidationResult> {
    const state = this.getState();
    const stepData = state.steps[stepId]?.data;
    
    // 1. 获取验证规则
    const validations = await this.getStepValidations(stepId);
    
    // 2. 执行客户端验证
    const clientResults = await this.executeClientValidations(validations, stepData);
    
    // 3. 执行服务端验证（如果有）
    const serverResults = await this.executeServerValidations(validations, stepData);
    
    // 4. 合并验证结果
    return this.mergeValidationResults(clientResults, serverResults);
  }

  // 获取步骤的验证规则
  private static async getStepValidations(stepId: string): Promise<ValidationRule[]> {
    // 1. 从配置中获取验证规则
    const config = await this.getStepConfig(stepId);
    return config.validations || [];
  }

  // 执行客户端验证
  private static async executeClientValidations(
    validations: ValidationRule[],
    data: any
  ): Promise<ValidationResult> {
    const clientValidations = validations.filter(v => v.type === "client");
    const results = await Promise.all(
      clientValidations.map(async rule => {
        const validator = await this.loadClientValidator(rule.validator);
        return validator(data, rule.params);
      })
    );
    return this.aggregateResults(results);
  }

  // 执行服务端验证
  private static async executeServerValidations(
    validations: ValidationRule[],
    data: any
  ): Promise<ValidationResult> {
    const serverValidations = validations.filter(v => v.type === "server");
    if (serverValidations.length === 0) return { valid: true };

    // 批量发送服务端验证请求
    const response = await fetch('/api/validate', {
      method: 'POST',
      body: JSON.stringify({
        validations: serverValidations,
        data: data
      })
    });

    return response.json();
  }

  // 获取步骤配置
  private static async getStepConfig(stepId: string): Promise<any> {
    // 实现从配置中获取步骤配置的逻辑
    return {};
  }

  // 加载客户端验证器
  private static async loadClientValidator(name: string): Promise<Function> {
    // 实现从客户端验证器注册表中加载验证器的逻辑
    return () => Promise.resolve({ valid: true });
  }

  // 聚合验证结果
  private static aggregateResults(results: ValidationResult[]): ValidationResult {
    // 实现聚合多个验证结果的逻辑
    return { valid: true };
  }

  // 合并验证结果
  private static mergeValidationResults(clientResult: ValidationResult, serverResult: ValidationResult): ValidationResult {
    // 实现合并客户端和服务端验证结果的逻辑
    return { valid: true };
  }
}
```

### 7. 验证器注册表
```typescript
class ValidatorRegistry {
  private static clientValidators: Map<string, Function> = new Map();

  // 注册客户端验证器
  static register(name: string, validator: Function): void {
    this.clientValidators.set(name, validator);
  }

  // 获取验证器
  static get(name: string): Function | undefined {
    return this.clientValidators.get(name);
  }
}

// 注册内置验证器
ValidatorRegistry.register('required', (value) => !!value);
ValidatorRegistry.register('maxAmount', (value, { max }) => value <= max);
ValidatorRegistry.register('taxFreeLimit', (value, { limit }) => {
  if (value <= limit) return true;
  return {
    valid: false,
    message: {
      type: "warning",
      content: `Amount exceeds tax-free limit of £${limit}`
    }
  };
});
```

### 8. 验证示例
```typescript
// 1. Section级别验证配置示例
const sectionValidation: SectionValidation = {
  type: "section",
  rules: [
    {
      type: "client",
      validator: "taxCalculation",
      dependsOn: ["withdrawalAmount", "taxFreeLimit"],
      async: true
    },
    {
      type: "server",
      validator: "/api/validate/tax-implications",
      dependsOn: ["withdrawalAmount", "pensionType"]
    }
  ],
  mode: "onChange",
  strategy: "all"
};

// 2. 字段级别验证配置示例
const amountValidation: FieldValidation = {
  type: "field",
  rules: [
    {
      type: "client",
      validator: "required",
      message: { type: "error", content: "Amount is required" }
    },
    {
      type: "client",
      validator: "maxAmount",
      params: { max: 100000 },
      message: { type: "error", content: "Amount cannot exceed £100,000" }
    }
  ],
  mode: "onBlur",
  debounce: 300
};

// 3. 使用验证器
async function validateWithdrawalSection(data: any): Promise<ValidationResult> {
  const validation = await FlowStateManager.validateStep('withdrawal-section');
  if (!validation.valid) {
    // 处理验证错误
    handleValidationErrors(validation.errors);
  } else if (validation.warnings?.length) {
    // 显示警告信息
    showWarnings(validation.warnings);
  }
  // 更新计算结果
  if (validation.calculations) {
    updateCalculations(validation.calculations);
  }
  return validation;
}
```

## 数据集成设计

### 1. 数据提供者定义
```typescript
interface DataProvider {
  id: string;
  dependencies?: string[];          // 依赖的其他提供者
  refreshTriggers?: string[];       // 触发刷新的字段
  fetch: (context: any) => Promise<any>;
}

const dataProviders: Record<string, DataProvider> = {
  'account-info': {
    id: 'account-info',
    fetch: async (context) => {
      const response = await fetch(`/api/accounts/${context.accountId}`);
      return response.json();
    }
  },
  'tax-calculation': {
    id: 'tax-calculation',
    dependencies: ['account-info'],
    refreshTriggers: ['withdrawalAmount'],
    fetch: async (context) => {
      const response = await fetch('/api/tax/calculate', {
        method: 'POST',
        body: JSON.stringify(context)
      });
      return response.json();
    }
  }
};
```

### 2. 数据管理器
```typescript
class FormDataManager {
  private cache: Map<string, any> = new Map();
  private providers: Record<string, DataProvider>;

  constructor(providers: Record<string, DataProvider>) {
    this.providers = providers;
  }

  async getDataForSection(sectionId: string, context: any): Promise<any> {
    const provider = this.findProviderForSection(sectionId);
    if (!provider) return null;

    // 检查依赖
    await this.loadDependencies(provider, context);

    // 获取数据
    const data = await provider.fetch(context);
    this.cache.set(provider.id, data);
    return data;
  }

  private async loadDependencies(provider: DataProvider, context: any) {
    if (!provider.dependencies) return;

    await Promise.all(
      provider.dependencies.map(async (depId) => {
        if (!this.cache.has(depId)) {
          const depProvider = this.providers[depId];
          const data = await depProvider.fetch(context);
          this.cache.set(depId, data);
        }
      })
    );
  }

  refreshData(trigger: string, context: any) {
    // 找到所有需要刷新的提供者
    const providersToRefresh = Object.values(this.providers)
      .filter(p => p.refreshTriggers?.includes(trigger));

    // 刷新数据
    return Promise.all(
      providersToRefresh.map(p => this.getDataForSection(p.id, context))
    );
  }
}
```

### 3. 组件集成
```typescript
const WithFormData: React.FC<{
  sectionId: string;
  children: (data: any) => React.ReactNode;
}> = ({ sectionId, children }) => {
  const [data, setData] = useState<any>(null);
  const { context } = useFormContext();
  const dataManager = useFormDataManager();

  useEffect(() => {
    const loadData = async () => {
      const sectionData = await dataManager.getDataForSection(sectionId, context);
      setData(sectionData);
    };
    loadData();
  }, [sectionId, context]);

  return children(data);
};

// 使用示例
const TaxCalculationSection: React.FC = () => {
  return (
    <WithFormData sectionId="tax-calculation">
      {(data) => (
        <div>
          <AmountInput
            value={data?.withdrawalAmount}
            max={data?.withdrawalLimits.max}
            onChange={async (value) => {
              // 触发数据刷新
              await dataManager.refreshData('withdrawalAmount', {
                withdrawalAmount: value
              });
            }}
          />
          {data?.warnings.map(warning => (
            <Warning key={warning.id} {...warning} />
          ))}
        </div>
      )}
    </WithFormData>
  );
};
```

## 错误处理

### 1. 数据加载错误
```typescript
interface DataLoadError {
  provider: string;
  error: string;
  retryable: boolean;
  context?: any;
}

class DataLoadingError extends Error {
  constructor(public details: DataLoadError) {
    super(`Failed to load data from ${details.provider}`);
  }
}
```

### 2. 错误恢复策略
```typescript
const dataLoadingStrategy = {
  retryAttempts: 3,
  retryDelay: 1000,
  fallbackData: {
    'account-info': {
      totalPension: 0,
      withdrawalLimits: { min: 0, max: 0 }
    }
  }
};
```

## 未来扩展计划

### 1. 服务端状态持久化
```typescript
// 预留的服务端API
interface ServerSideAPIs {
  // 保存步骤数据
  POST /api/forms/{formId}/save
  请求体: {
    sessionToken: string;
    currentStep: string;
    data: any;
  }

  // 恢复表单数据
  GET /api/forms/{formId}/restore
  参数: sessionToken

  // 数据迁移
  POST /api/flow/migrate
  请求体: {
    sessionToken: string;
    flowState: FlowState;
  }
}

// 服务端状态模型
interface ServerFlowState {
  sessionToken: string;
  userId?: string;
  flowId: string;
  steps: {
    [stepId: string]: {
      status: string;
      data: any;
      lastModified: Date;
    };
  };
  metadata: {
    startedAt: Date;
    lastActivity: Date;
    completedAt?: Date;
    source?: string;
  };
}
```

### 2. 动态流程配置
```typescript
interface FlowConfiguration {
  steps: {
    [stepId: string]: {
      order: number;
      required: boolean;
      conditions?: {
        field: string;
        operator: string;
        value: any;
        nextStep: string;
      }[];
    };
  };
  validations: {
    [stepId: string]: ValidationRule[];
  };
}
```

### 3. 审计日志
```typescript
interface AuditLog {
  timestamp: Date;
  action: string;
  stepId: string;
  data: any;
  userId?: string;
  source: string;
}
```

## 简化设计要点

1. **配置驱动**
```json
// config/forms/tax-calculation.json
{
  "id": "tax-calculation",
  "layout": {
    "type": "main-content",
    "sections": [
      {
        "title": "Withdrawal amount",
        "rows": [
          {
            "type": "row",
            "leftColumn": {...},
            "rightColumn": {...}
          }
        ]
      }
    ]
  }
}
```

2. **验证规则内联**
```javascript
// validators/tax-calculation.js
module.exports = {
  validateWithdrawalAmount: (amount, context) => {
    const { totalPension } = context;
    if (amount > totalPension) {
      return "提取金额不能超过总金额";
    }
    return true;
  }
}
```

3. **状态管理预留**
```markdown
POST /api/submit?sessionId=临时令牌
```

4. **扩展性保留**
- 配置热重载能力
- 验证器动态注册
- 条件表达式引擎
- 动态计算规则引擎

## 演进路线
```mermaid
graph LR
  A[静态配置] --> B[动态加载配置]
  B --> C[数据库存储配置]
  C --> D[可视化配置界面]
```

## 优势对比
| 维度         | 原方案               | 新方案               |
|--------------|----------------------|----------------------|
| 部署复杂度   | 需要数据库初始化     | 零依赖启动           |
| 流程修改     | 需要DBA参与          | 修改配置文件即可     |
| 扩展成本     | 需要修改数据模型     | 增加配置节点         |
| 适合场景     | 高频变更的大型系统   | 低频变更的中小系统   |

## 微前端集成方案

### 1. 模块导出定义
```typescript
// pension-withdrawal/src/index.ts
import { PensionWithdrawalFlow } from './components/PensionWithdrawalFlow';
import type { FlowConfig, FlowProps, FlowRef } from './types';

// 导出主组件
export { PensionWithdrawalFlow };

// 导出类型定义
export type { FlowConfig, FlowProps, FlowRef };

// 导出工具函数
export {
  createFlowConfig,
  validateFlowData,
  getFlowStatus
} from './utils';
```

### 2. 组件集成接口
```typescript
// 组件属性定义
interface FlowProps {
  // 基础配置
  config: {
    apiBase: string;           // API基础路径
    totalPension: number;      // 总养老金额度
    theme?: DeepPartial<Theme>;// 主题覆盖
  };
  // 事件处理
  onComplete?: (result: SubmitResult) => void;
  onCancel?: () => void;
  onError?: (error: FlowError) => void;
  // 状态同步
  onStateChange?: (state: FlowState) => void;
  // UI定制
  components?: {
    Button?: ComponentType<ButtonProps>;
    Card?: ComponentType<CardProps>;
    // ... 其他可覆盖的组件
  };
  // 验证器扩展
  validators?: Record<string, ValidatorFn>;
}

// 组件引用接口
interface FlowRef {
  // 控制方法
  start: () => void;
  reset: () => void;
  goToStep: (stepId: string) => void;
  // 状态查询
  getCurrentStep: () => string;
  getStepData: (stepId: string) => any;
  validate: () => Promise<ValidationResult>;
}
```

### 3. 主应用集成示例
```typescript
// 1. 使用 Module Federation 配置
// pension-withdrawal/webpack.config.js
module.exports = {
  // ...其他配置
  plugins: [
    new ModuleFederationPlugin({
      name: 'pensionWithdrawal',
      filename: 'remoteEntry.js',
      exposes: {
        './PensionFlow': './src/index.ts',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@mui/material': { singleton: true },
        // ... 其他共享依赖
      }
    })
  ]
};

// 2. 主应用中使用
// host-app/src/pages/PensionPage.tsx
import { lazy, Suspense } from 'react';
import { ThemeProvider } from '@mui/material';

const PensionWithdrawalFlow = lazy(() => import('pensionWithdrawal/PensionFlow'));

const PensionPage: React.FC = () => {
  const handleComplete = (result) => {
    // 处理完成逻辑
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ThemeProvider theme={appTheme}>
        <PensionWithdrawalFlow
          config={{
            apiBase: '/api/pension',
            totalPension: 100000,
            theme: {
              // 主题覆盖配置
              palette: {
                primary: appTheme.palette.primary
              }
            }
          }}
          onComplete={handleComplete}
          components={{
            // 使用主应用的组件覆盖默认组件
            Button: AppButton,
            Card: AppCard
          }}
        />
      </ThemeProvider>
    </Suspense>
  );
};
```

### 4. 状态共享机制
```typescript
// 1. 定义共享事件
export enum FlowEvents {
  STEP_CHANGE = 'PENSION_FLOW_STEP_CHANGE',
  DATA_UPDATE = 'PENSION_FLOW_DATA_UPDATE',
  VALIDATION = 'PENSION_FLOW_VALIDATION',
  COMPLETE = 'PENSION_FLOW_COMPLETE'
}

// 2. 实现事件总线
class FlowEventBus {
  static emit(event: FlowEvents, data: any) {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  static on(event: FlowEvents, handler: (data: any) => void) {
    window.addEventListener(event, (e: CustomEvent) => handler(e.detail));
  }
}

// 3. 组件中使用
class PensionWithdrawalFlow extends React.Component<FlowProps> {
  componentDidUpdate(prevProps: FlowProps) {
    if (this.state.currentStep !== prevState.currentStep) {
      FlowEventBus.emit(FlowEvents.STEP_CHANGE, {
        step: this.state.currentStep,
        data: this.state.stepData
      });
    }
  }
}
```

### 5. 样式隔离
```typescript
// 1. CSS 模块配置
// pension-withdrawal/webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]'
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  }
};

// 2. 组件样式封装
// pension-withdrawal/src/components/PensionWithdrawalFlow/styles.ts
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    // 使用特定前缀避免样式冲突
    '& .pension-flow': {
      // 容器样式
    }
  },
  // 其他样式定义
}));
```

### 6. 错误边界处理
```typescript
class FlowErrorBoundary extends React.Component<{ onError?: (error: Error) => void }> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error);
    // 错误上报逻辑
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### 7. 性能优化
```typescript
// 1. 组件代码分割
const StepComponents = {
  'tax-calculation': lazy(() => import('./steps/TaxCalculation')),
  'investment-choice': lazy(() => import('./steps/InvestmentChoice')),
  // ... 其他步骤组件
};

// 2. 资源预加载
const PensionWithdrawalFlow: React.FC<FlowProps> = (props) => {
  useEffect(() => {
    // 预加载下一步骤的组件
    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      const NextStepComponent = StepComponents[nextStep];
      NextStepComponent.preload?.();
    }
  }, [currentStep]);

  return (/* ... */);
};
```
