/// <reference types="cypress" />

describe('SauceDemo Purchase Flow', () => {
  beforeEach(() => {
    // Visit the SauceDemo site before each test
    cy.visit('https://www.saucedemo.com/');
  });

  it('should complete a purchase successfully', () => {
    // ---- Step 1: Log in ----
    // Using standard demo credentials from the official site
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();

    // Assertion: Check if redirected to inventory page
    cy.url().should('include', '/inventory.html');
    cy.get('.title').should('have.text', 'Products');

    // ---- Step 2: Sort items by price (low to high) ----
    cy.get('[data-test="product-sort-container"]').select('Price (low to high)');
    // Verify sorting dropdown works
    cy.get('[data-test="product-sort-container"]').should('have.value', 'lohi');

    // ---- Step 3: Add at least one item to the cart ----
    cy.get('.inventory_item').first().within(() => {
      cy.get('button').click(); // Click "Add to cart"
    });

    // Assert cart badge shows 1 item
    cy.get('.shopping_cart_badge').should('have.text', '1');

    // ---- Step 4: Go to the cart and proceed to checkout ----
    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');
    cy.contains('Your Cart').should('be.visible');

    cy.get('[data-test="checkout"]').click();

    // ---- Step 5: Fill in checkout info ----
    cy.get('[data-test="firstName"]').type('John');
    cy.get('[data-test="lastName"]').type('Doe');
    cy.get('[data-test="postalCode"]').type('12345');
    cy.get('[data-test="continue"]').click();

    // ---- Step 6: Review & Complete the purchase ----
    cy.url().should('include', '/checkout-step-two.html');
    cy.contains('Payment Information').should('be.visible');

    cy.get('[data-test="finish"]').click();

    // ---- Step 7: Assert that the order was successful ----
    cy.url().should('include', '/checkout-complete.html');
    cy.get('.complete-header').should('have.text', 'Thank you for your order!');
    cy.get('.complete-text').should('contain', 'Your order has been dispatched');

    // Optional: Verify back home button
    cy.get('[data-test="back-to-products"]').should('be.visible');
  });
});
