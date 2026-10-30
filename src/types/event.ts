export type EventType = 'wedding' | 'birthday' | 'community';

export interface EventInput {
  eventType: EventType;
  subType?: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  guestCount: number;
  budgetINR: number;
  preferences: string[];
  customNotes?: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  allocatedINR: number;
  percentage: number;
  priority: 'Must-Have' | 'Recommended' | 'Optional';
  description: string;
  moneySavingTip: string;
  spentINR?: number;
  isBooked?: boolean;
}

export type TimelinePhase = 
  | '6-12 Months Before'
  | '3-6 Months Before'
  | '1-2 Months Before'
  | '2-3 Weeks Before'
  | 'Week of Event'
  | 'Event Day'
  | 'Post-Event';

export interface TimelineTask {
  id: string;
  phase: TimelinePhase;
  title: string;
  description: string;
  deadlineOffset: string;
  calculatedDate?: string;
  category: string;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
}

export type VendorStatus = 'To Contact' | 'Shortlisted' | 'Negotiating' | 'Booked';

export interface VendorItem {
  id: string;
  category: string;
  estimatedCostINR: string;
  importance: 'Critical' | 'Important' | 'Optional';
  questionsToAsk: string[];
  deliverablesChecklist: string[];
  status: VendorStatus;
  notes?: string;
  vendorName?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ThemeIdea {
  name: string;
  tagline: string;
  description: string;
  colorPalette: ColorSwatch[];
  vibeTags: string[];
  dressCode: string;
}

export interface DecorSuggestion {
  area: string;
  idea: string;
  elements: string[];
}

export interface FoodAndBeveragePlan {
  welcomeDrinks: string[];
  appetizers: string[];
  mainCourseHighlights: string[];
  dessertStations: string[];
  cateringTips: string[];
}

export interface InvitationSuite {
  digitalCardCopy: string;
  whatsappMessageTemplate: string;
  formalInvitationText: string;
  designAestheticPrompt: string;
  rsvpDeadlineRecommendation: string;
}

export interface CreativeIdeas {
  themes: ThemeIdea[];
  decorSuggestions: DecorSuggestion[];
  foodAndBeverage: FoodAndBeveragePlan;
  invitations: InvitationSuite;
}

export interface EventPlan {
  id: string;
  createdAt: string;
  lastSavedAt?: string;
  input: EventInput;
  executiveSummary: string;
  budgetBreakdown: BudgetItem[];
  timeline: TimelineTask[];
  vendorChecklist: VendorItem[];
  creativeIdeas: CreativeIdeas;
  smartRecommendations: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
