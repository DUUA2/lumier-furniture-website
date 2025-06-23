import { relations } from "drizzle-orm/relations";
import { subscriptionPlans, subscriptions, orders } from "./schema";

export const subscriptionsRelations = relations(subscriptions, ({one, many}) => ({
	subscriptionPlan: one(subscriptionPlans, {
		fields: [subscriptions.planId],
		references: [subscriptionPlans.id]
	}),
	orders: many(orders),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({many}) => ({
	subscriptions: many(subscriptions),
}));

export const ordersRelations = relations(orders, ({one}) => ({
	subscription: one(subscriptions, {
		fields: [orders.subscriptionId],
		references: [subscriptions.id]
	}),
}));