
describe('Dockstore Tool Details', function() {

	beforeEach(function () {
     cy.visit("http://localhost:9000/containers/quay.io/dockstoretestuser2/dockstore-tool-imports")
  });

  it('Change tab to labels', function() {
    cy
      .get("#tool_tabs>ul")
          .children(":nth-child(2)")
          .click()
  });

  it('Change tab to versions', function() {
    cy
      .get("#tool_tabs>ul")
          .children(":nth-child(3)")
          .click()
  });

  describe('Change tab to files', function() {
    beforeEach(function() {
      cy
        .get("#tool_tabs>ul")
          .children(":nth-child(4)")
          .click()
    });

    it('Should have Dockerfile tab selected', function() {
      cy
        .get(".file-tabs")
          .children('div')
          .first()
          .children('button')
          .first()
          .should("have.class", "active")
    });

    it('Should have content in file viewer', function() {
      cy
        .get(".hljs.yaml")
          .children()
          .should("exist")
    });

      describe('Change tab to Descriptor files', function() {
          beforeEach(function() {
            cy
              .get(".file-tabs")
                .children('div')
                .first()
                .next()
                .children('button')
                .click()
          });

          it('Should have content in file viewer', function() {
            cy
              .get(".hljs.yaml")
                .children()
                .should("exist")
          });
      });

      describe('Change tab to Test Parameters', function() {
          beforeEach(function() {
            cy
              .get(".file-tabs")
                .children('div')
                .first()
                .next()
                .next()
                .children('button')
                .click()
          });

          it('Should not have content in file viewer', function() {
            cy
              .get(".hljs.yaml")
                .children()
                .should("not.exist")
          });
      });
  });
})
