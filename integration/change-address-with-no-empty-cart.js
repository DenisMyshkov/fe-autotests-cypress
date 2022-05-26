import users from '../fixtures/users.json'
import {pepsi_address} from '../credentials/address.js';
let address = pepsi_address;

describe("Change address when cart is not empty", function () {
    let user_id
    let aer_user_id
    let aer_cart_id

    before('Get available user', function() {
        cy.getUser().as('user').then((user) => {
            user_id = user.id
            aer_user_id = user.user_id
            aer_cart_id = user.cart_id
        })
    })

    beforeEach(function() {
        cy.setAddress(aer_user_id, address)
        cy.cleanUserCart(aer_cart_id)
        cy.login(aer_user_id)
    })

    after('Let User', () => {
        cy.letUser(user_id)
    })

    it("Change address when cart is not empty", function () {
        cy.openApp()
        cy.get('[qa-locator-alias="qa-shopList-shop-pepsi"]').click()
        cy.contains('PEPSI')
        cy.get('[qa-locator-name="qa-categoryList-category"]').contains('Молоко и яйца').click()
        cy.get('[qa-locator-name="qa-itemList-item-addItem"]').first().click()
        cy.get('[qa-locator-name="qa-header-backArrow"]').first().click()
        cy.get('[qa-locator-name="qa-header-backArrow"]').first().click()
        cy.get('[qa-locator-name="qa-header-headerMiddle-addressPlate"]').click()
        cy.get('[qa-locator-name="qa-userAddressesBottomSlider-address-data"]').contains('бульвар Новаторов, 10').click()
        cy.get('[qa-locator-name="qa-userAddressesBottomSlider-confirmButton"]').click()

        cy.get('[id="bottomSliderContent"]').should('exist')
        cy.contains('PEPSI не доставляет по этому адресу. Для заказа в другом магазине, очистите корзину').should('exist')
        cy.get('button').contains('Очистить корзину').should('exist')
        cy.get('button').contains('Отменить').should('exist')
    })
})