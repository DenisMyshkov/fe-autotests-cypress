// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "cypress-localstorage-commands"

Cypress.Commands.add('getUserTest', () => {
    cy.request({
        method: 'GET',
        url: 'http://127.0.0.1:8000/clients_list'
    }).its('body').as('user')
});

Cypress.Commands.add('getUser', () => {
    cy.request({
        method: 'GET',
        url: 'http://127.0.0.1:8000/clients_list'
    }).then( (response) => {
        return response.body
    });
});

Cypress.Commands.add('letUser', (user_id) => {
    cy.request({
        method: 'POST',
        url: `http://127.0.0.1:8000/clients_list/${user_id}`
    });
});

Cypress.Commands.add('openApp', () => {
    cy.visit('/', {
        headers: {
            'user-agent': 'Mozilla/5.0 (Linux; Android 11; CPH2043 Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile Safari/537.36 AliApp(AliexpressAndroid/8.20.80.216833) TTID/YYEPio1KwLADAPE+QM8XjdB1 WindVane/8.5.0 AliApp(AE/8.20.80.216833) AE_LANG(ru-RU) AER',
            'x-aer-fmcg-user-ab-group': '171'
        }
    })
})

Cypress.Commands.add('login', (user_id) => {
    cy.setLocalStorage('aer-x-user-id', user_id)
    cy.setCookie('aer-x-user-id', user_id)
})

Cypress.Commands.add('backToMain', () => {
    while (cy.get('[qa-locator-name="qa-header-headerMiddle-addressPlate"]').should('not.exist')) {
        cy.get('[src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuNDE0IDExaDEzLjY0MmMuNTIxIDAgLjk0NC40NDQuOTQ0IDEgMCAuNTUyLS40MiAxLS45NDQgMUg2LjQxNGwyLjI5MyAyLjI5M2ExIDEgMCAxMS0xLjQxNCAxLjQxNGwtNC00YTEgMSAwIDAxMC0xLjQxNGw0LTRhMSAxIDAgMDExLjQxNCAxLjQxNEw2LjQxNCAxMXoiIGZpbGw9IiMyMjIiLz48L3N2Zz4="]').first().click({force: true})
    }
})

Cypress.Commands.add('setUserAdult', (user_idi, value) => {
    return cy.request({
        method: 'POST',
        url: 'http://dbg-fmcg-service-user.dev1.k8s.ae-rus.net/api/v1/user/set-is-adult',
        headers: {
            'accept': 'text/plain',
            'Content-Type': 'application/json-patch+json'
        },
        body: {
            'user_id': user_idi,
            'is_adult': value
        }
    })
})

Cypress.Commands.add('cleanUserCart', (cart_id) => {
    cy.request({
        method: 'POST',
        url: 'https://dbg-fmcg-service-cart.dev1.k8s.ae-rus.net/api/v2/cart/clean',
        body: {
            'cart_ids': [
                cart_id
            ]
        }
    })
})

Cypress.Commands.add('setUserAddress', (address) => {

})


Cypress.Commands.add('createOrder', (user_id) => {
    cy.request({
        method: 'POST',
        url: 'http://qa-fmcg-autotests.dev1.k8s.ae-rus.net/v1/make_order/?seller_name=pepsi-moscow',
        headers: {            
            'accept': 'text/plain',
            'Content-Type': 'application/json-patch+json'
        },
        body: {
            "user_id": user_id,
            "order_lines": 1,
            "search_item": "Пепси в стекле",
            "bank_card": "5555 5555 5555 5599",
            "wait_successful_payment": true
          }
    }).then( (response) => {
        return response.body
    })
})

Cypress.Commands.add('cancelOrder', (order_id) => {
    cy.request({
        method: 'POST',
        url: 'https://dbg-fmcg-service-order.dev1.k8s.ae-rus.net/api/v1/order/to-cancelled-status',
        headers: {            
            'accept': 'text/plain',
            'Content-Type': 'application/json-patch+json'
        },
        body: {
            "order_id": order_id,
            "initiator": "System",
            "reason_type": "1",
            "reason": "1",
            "cancel_option": "1",
            "updated_by": 0
          }
    })
})
Cypress.Commands.add('setAddress', (user_id, address) => {
    cy.clearLocalStorage();
    cy.request({
        method: 'POST',
        url: 'https://dbg-fmcg-web-address.dev1.k8s.ae-rus.net/api/v1/buyer-address/use',
        headers: {                
            'accept': 'text/plain',
            'Content-Type': 'application/json-patch+json',
            'x-user-id': user_id
        },
        body: address
        });
});