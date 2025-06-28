export const optionsForCloseAccount: string[] = [
    "Need to update personal info (email/phone number)",
    "Found a better banking option",
    "I created my account by mistake",
    "No longer need this account",
    "Dissatisfied with the bank's customer service",
    "Limited account features not meeting requirements",
    "Parent/guardian decision to switch to a different bank",
    "Teen’s decision to switch to a different bank",
    "Moving to a different city or Country",
    "Experiencing technical difficulties with the app",
    "Other"
];

export const CAccountStatus = {
  ACTIVE: 'ACTIVE',
  DELETE_IN_PROGRESS: 'DELETE_IN_PROGRESS',
  MANUAL_REVIEW_REQUIRED: 'MANUAL_REVIEW_REQUIRED',
  CLOSED: 'CLOSED',
} as const;

export const CBankAccountStatus = {
  CLOSED: 'closed',
	ENABLED: 'enabled',
	DISABLED: 'disabled'
} as const;