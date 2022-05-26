describe("Open chat", () => {
    let user_id
    let aer_user_id
    let aer_cart_id
    let order_id
    let order_number

    before('Get available user', function () {
        cy.getUser().then((user) => {
            user_id = user.id
            aer_user_id = user.user_id
            aer_cart_id = user.cart_id
        })
    });


    beforeEach('Clean user cart, longi user, create order', () => {
        cy.cleanUserCart(aer_cart_id)
        cy.login(aer_user_id)
        cy.createOrder(aer_user_id).then((response) => {        
            order_id = response.order_creation_info._order_id
            order_number= response.order_creation_info._number
        })
    })

    after('Let User, cancel order', () => {
        cy.letUser(user_id)
        cy.cancelOrder(order_id)
    })

    it("Open chat", () => {
        cy.server({onAnyRequest: function (route, proxy) {
            proxy.xhr.setRequestHeader('X-Aer-Buyer-Id', aer_user_id)
        }});
        cy.visit(`/order/${order_number}`, {
            headers: {
                'user-agent': '',
                'x-aer-fmcg-user-ab-group': '',
            }
        })
        cy.contains('Проблемы с заказом?').click()
        cy.contains('Поддержка').should('exist')
        cy.contains(order_number).should('exist')
        cy.contains('Оператор обычно отвечает в течение 30 минут.').should('exist')
    })
})