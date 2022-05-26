describe('Energy drinks tests', function () {
    let user_id
    let aer_user_id
    let aer_cart_id

    before('Get available user', function () {
        cy.getUser().then((user) => {
            user_id = user.id
            aer_user_id = user.user_id
            aer_cart_id = user.cart_id
        })
    });

    beforeEach(function() {
        cy.setUserAdult(aer_user_id, false)
        cy.cleanUserCart(aer_cart_id)
        cy.login(aer_user_id)
    })

    after('Let User', () => {
        cy.letUser(user_id);
    });

    it('Item cart has opacity 05', function () {
        cy.openApp()
        cy.get('[qa-locator-alias="qa-shopList-shop-pepsi"]').click()
        cy.contains('PEPSI')
        cy.get('[qa-locator-name="qa-mainSearch"]').click()
        cy.get('input').type('Энергетики{enter}')
        cy.get('[qa-locator-name="qa-itemList-item-addItem"]').first().click()
        cy.get('[qa-locator-name="qa-bottomSlider-isAdult-noButton"]').click()

        cy.get('[data-exp-s]').should('have.css', 'opacity', '0.5')
        cy.get('[qa-locator-name="qa-itemList-item-addItem"]').should('have.css', 'opacity', '0.5')
    })

    after('Let User', () => {
        cy.letUser(user_id);
    });
})