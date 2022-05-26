describe('E2E buy', function() {
    let user_id
    let aer_user_id
    let aer_cart_id
    let orderSum
    let orderNumber

    before('Get available user', function() {
        cy.getUser().as('user').then((user) => {
            user_id = user.id
            aer_user_id = user.user_id
            aer_cart_id = user.cart_id
        })
    })

    beforeEach(function() {
        cy.cleanUserCart(aer_cart_id)
        cy.login(aer_user_id)
    })

    after('Let User', () => {
        cy.letUser(user_id)
    })

    it('Create order', function() {
        cy.intercept('**/order/create').as('createOrder')
        cy.openApp()
        cy.get('[qa-locator-alias="qa-shopList-shop-pepsi"]').click()
        cy.contains('PEPSI')
        cy.get('[qa-locator-name="qa-categoryList-category"]').contains('Молоко и яйца').click()
        cy.get('[qa-locator-name="qa-itemList-item-addItem"]').first().click()
        cy.get('[qa-locator-name="qa-checkout-payButton"]').last().click()
        cy.get('[qa-locator-name="qa-cart-cartTotalPrice"]').then((price) => {
            orderSum = price.text()
        })
        cy.contains('Итого')
        cy.contains('Продолжить').click()
        cy.get('[qa-locator-name="qa-checkout-clientName"]').clear().type('Anton')
        cy.get('[qa-locator-name="qa-checkout-clientPhone"]').clear().type('9991111111')
        cy.contains('Оплатить').click()
        cy.wait('@createOrder').then(xhr => {
            orderNumber = xhr.response.body.data.number
        })
        cy.contains('Заказ оформлен').should('exist')
        cy.get('[qa-locator-name="qa-checkout-toOrderListButton"]').click()

        cy.get('[qa-locator-id]').first().within((div) => {
            cy.get('[qa-locator-name="qa-order-orderNumber"]').should('have.text', orderNumber)
            cy.get('[qa-locator-name="qa-order-orderTotalAmount"]').then((sum) => {
                expect(orderSum).to.contain(sum.text())
            })
            cy.get('[qa-locator-name="qa-order-orderStatus"]').find('div').should('have.text', 'Подтверждён')
        })

    })

    it('Cancel order', function() {
        cy.openApp()
        cy.get('div [qa-locator-name="qa-header-menuButton"]').first().click()
        cy.get('[href="/profile/orders"]').click()
        cy.get('[qa-locator-name="qa-order-orderNumber"]').contains(orderNumber).click()
        cy.get('[qa-locator-name="qa-order-cancelOrder"]').click()
        cy.get('[qa-locator-name="qa-bottomSlider-cancelOrder"]').click()
        cy.get('[qa-locator-name="qa-bottomSlider-understand"]').click()

        cy.get('[qa-locator-id]').first().within((div) => {
            cy.get('[qa-locator-name="qa-order-orderStatus"]').find('div').should('have.text', 'Отменён')
        })
    })
})