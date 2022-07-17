describe('flight-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should do a sanity check', () => {
    cy.visit('');
  });

  it('should load page below 1 second', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('start-loading');
      },
      onLoad: (win) => {
        win.performance.mark('end-loading');
      }
    })
      .its('performance')
      .then((p) => {
        p.measure('pageLoad', 'start-loading', 'end-loading');
        const measure = p.getEntriesByName('pageLoad')[0];
        expect(measure.duration).to.be.most(1000);
      });
  });

  it('should have UTF-8 as charset', () => {
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8');
  });

  it('should do an implicit subject assertion', () => {
    cy.get('.sidebar-wrapper ul.nav li:last a').should('contain.text', 'Basket');
  });

  it('should do an explicit subject assertion', () => {
    cy.get('.sidebar-wrapper ul.nav li:nth-child(2) a').should(($a) => {
      expect($a).to.contain.text('Flights');
      expect($a).to.have.attr('href', '/flight-booking/flight-search');
    });
  });

  it('should count the nav entries', () => {
    cy.get('.sidebar-wrapper ul.nav li').its('length').should('be.gte', 3);
  });
});
