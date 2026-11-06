import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'A valid record ID is required.');
const date = z.coerce.date();
const email = z.string().trim().email().max(254);
const paymentMode = z.enum(['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Card']);

const residentProfile = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(7).max(30),
  flatNo: z.string().trim().min(1).max(30),
  wing: z.string().trim().max(30).optional().default(''),
  type: z.enum(['Owner', 'Tenant']).default('Owner'),
});

export const registerSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(8).max(128),
  }),
});

export const passwordResetSchema = z.object({
  body: z.object({ email }),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1).max(128),
  }),
});

export const googleLoginSchema = z.object({
  body: z.object({ idToken: z.string().min(1) }),
});

export const accountProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(120).optional(),
    profile: residentProfile.optional(),
    password: z.string().min(8).max(128).optional(),
  }).refine((body) => (
    (Boolean(body.name) && !body.profile && !body.password)
    || (Boolean(body.profile) && !body.name)
  ), {
    message: 'Provide either an administrator name or a resident profile.',
  }),
});

export const incomeSchema = z.object({
  body: z.object({
    description: z.string().trim().min(1).max(240),
    category: z.string().trim().min(1).max(80),
    amount: z.coerce.number().positive(),
    date,
    paymentMode,
    transactionRef: z.string().trim().max(120).optional().default(''),
    resident: objectId.optional().nullable(),
    residentName: z.string().trim().max(120).optional().default(''),
    flat: z.string().trim().max(50).optional().default(''),
    remarks: z.string().trim().max(1000).optional().default(''),
  }),
});

export const expenseSchema = z.object({
  body: z.object({
    description: z.string().trim().min(1).max(240),
    category: z.string().trim().min(1).max(80),
    vendor: z.string().trim().max(160).optional().default(''),
    amount: z.coerce.number().positive(),
    date,
    paymentStatus: z.enum(['Paid', 'Pending', 'Overdue', 'Cancelled']),
    paymentMode: paymentMode.nullable().optional(),
    transactionRef: z.string().trim().max(120).optional().default(''),
    hasInvoice: z.boolean().optional().default(false),
    remarks: z.string().trim().max(1000).optional().default(''),
  }),
});

export const residentSchema = z.object({
  body: z.object({
    email,
    profile: z.object({
      name: z.string().trim().min(1).max(120),
      phone: z.string().trim().min(7).max(30),
      flatNo: z.string().trim().min(1).max(30),
      wing: z.string().trim().max(30).optional().default(''),
      type: z.enum(['Owner', 'Tenant']),
      maintenanceAmount: z.coerce.number().min(0),
      membershipStatus: z.enum(['Active', 'Inactive']).default('Active'),
    }),
  }),
});

export const dueSchema = z.object({
  body: z.object({
    resident: objectId,
    month: z.string().trim().min(1).max(40),
    category: z.string().trim().min(1).max(80),
    amount: z.coerce.number().min(0),
    penalty: z.coerce.number().min(0).optional().default(0),
    dueDate: date,
  }),
});

export const residentPaymentSchema = z.object({
  body: z.object({
    dueIds: z.array(objectId).min(1).max(20).optional(),
    payAll: z.boolean().optional().default(false),
    paymentMode,
  }).refine((body) => body.payAll || body.dueIds?.length, {
    message: 'Select at least one due to pay.',
    path: ['dueIds'],
  }),
});

export const adminPaymentSchema = z.object({
  body: z.object({
    resident: objectId,
    dueIds: z.array(objectId).min(1).max(20),
    amount: z.coerce.number().positive(),
    paymentMode,
    transactionId: z.string().trim().max(120).optional().default(''),
    date: date.optional(),
    status: z.enum(['pending', 'completed']).optional(),
  }),
});

export const paymentStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ status: z.enum(['completed', 'failed']) }),
});

export const idParamSchema = z.object({
  params: z.object({ id: objectId }),
});

const residentDuesQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    status: z.enum(['pending', 'partially_paid', 'paid', 'cancelled']).optional(),
  }),
});
export const residentDuesListSchema = residentDuesQuerySchema;
export const residentDuesByIdSchema = residentDuesQuerySchema.extend({
  params: z.object({ id: objectId }),
});

export const listQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    search: z.string().trim().max(120).optional(),
    category: z.string().trim().max(80).optional(),
    paymentMode: z.string().trim().max(40).optional(),
    vendor: z.string().trim().max(160).optional(),
    status: z.string().trim().max(40).optional(),
    resident: objectId.optional(),
    dateFrom: z.string().date().optional(),
    dateTo: z.string().date().optional(),
    type: z.enum(['income', 'expense']).optional(),
  }).refine((query) => !query.dateFrom || !query.dateTo || query.dateFrom <= query.dateTo, {
    message: 'dateFrom must be before or equal to dateTo.',
    path: ['dateTo'],
  }),
});

export const settingsSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(160),
    address: z.string().trim().max(500).optional().default(''),
    email: z.string().trim().email().max(254).or(z.literal('')).optional().default(''),
    phone: z.string().trim().max(30).optional().default(''),
    registrationNumber: z.string().trim().max(100).optional().default(''),
    financialYear: z.string().trim().max(20).optional().default(''),
    maintenanceAmount: z.coerce.number().min(0),
    dueDate: z.coerce.number().int().min(1).max(28),
    lateFeePercentage: z.coerce.number().min(0).max(100),
  }),
});

export const categorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(80),
    type: z.enum(['income', 'expense']),
    active: z.boolean().optional().default(true),
  }),
});
