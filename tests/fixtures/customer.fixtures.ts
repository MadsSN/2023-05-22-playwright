import { CustomersPage } from "../page-objects/customers-page";

export interface CustomerFixtures {
  customersPage: CustomersPage;
}

export const customerFixtures = {
  customersPage: async ({ page }, use) => {
    console.log("aktiviere customers Page");
    const customerPage = new CustomersPage(page);
    await use(customerPage);
  },
};
