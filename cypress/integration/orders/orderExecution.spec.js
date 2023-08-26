
//only testing buy side because the components are the same
describe('Buy and/or Sell Market Orders Input/Submit UI', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('accepts input', () => {
        const typedText = '0.00001'
        cy.get('[data-testid=buysellorderinput]:first').within(() => {
            cy.get('input').type(typedText)
            .should('have.value', typedText)
        })
    })

    it('Doesnt allow a button click if nothing is entered ', () => {
        cy.get('[data-testid=buysellordercontainer]:first').within(() => {
            cy.get('button').should('be.disabled')
        })
    })

    it('lets you submit a buy order and clears out', () => {
        cy.get('[data-testid=buysellorderinput]:first').within(() => {
            cy.get('input').type('0.00001')
        })
        cy.get('[data-testid=buysellordercontainer]:first').within(() => {
            cy.get('button').click()
        })
        cy.get('[data-testid=buysellorderinput]:first').within(() => {
            cy.get('input').should('have.value', '0')
        })
    })
})

describe('Buy and/or Sell Market Orders After Submit Appear Where Expected', () => {
    beforeEach(() => {
        cy.visit('/')
    })
    //assume that all orders fill immediately for now
    it('Form Submission of Market Order shows 1 order in order history', () => {
        cy.get('[data-testid=buysellorderinput]:first').within(() => {
            cy.get('input').type('0.00001')
        })
        cy.get('[data-testid=buysellordercontainer]:first').within(() => {
            cy.get('button').click()
        })
        
        cy.get('[data-testid=rightlowersectiongrid]').within(() => {
            cy.get('div div').click()
        })
        cy.get('ul').find('li').contains('Order History').click()
        cy.get('.ReactTable').find('[data-testid=orderhistory]')
            .should('have.length', 1)
    })
})