import { Page } from "@playwright/test";

interface CustomerData {
  firstname?: string;
  lastname?: string;
  birthday?: Date;
  country?: string;
}

export class CustomerPage {
  constructor(private page: Page) {}

  async fillIn(customerData: CustomerData) {
    if (customerData.firstname !== undefined) {
      await this.page.fill("data-testid=inp-firstname", customerData.firstname);
    }

    if (customerData.lastname !== undefined) {
      await this.page.fill("data-testid=inp-lastname", customerData.lastname);
    }

    if (customerData.birthday !== undefined) {
      const day = customerData.birthday.getDate();
      const month = customerData.birthday.getMonth() + 1;
      const year = customerData.birthday.getFullYear();
      await this.page.fill(
        "data-testid=inp-birthdate",
        `${day}.${month}.${year}`
      );
    }

    if (customerData.country !== undefined) {
      await this.page.click("data-testid=inp-country");
      await this.page.click("mat-option >> text=Greece");
    }
  }

  async submit() {
    await this.page.click("data-testid=btn-submit");
  }

  async remove() {
    await this.page.click("data-testid=btn-delete");
  }
}
