
describe('Dockstore Workflow Details', function() {

	beforeEach(function () {
     cy.visit("http://localhost:9000/workflows/DockstoreTestUser2/test_workflow_cwl")
  });

	it('should not show Edit Button', function() {
    // edit button should only appear inside "My Workflows"
    // unless logged in as the author, edit button should not be present in "Workflows"
    cy
      .get("#editButton")
        .should("exist")
        .should("not.be.visible")
  });

  it('Change tab to labels', function() {
    cy
      .get("#workflow_tabs>ul")
        .children()
        .not(".active")
        .first()
        .click()
  });

  it('Change tab to versions', function() {
    cy
      .get("#workflow_tabs>ul")
        .children()
        .not(".active")
        .first()
        .next()
        .click()
  });

  describe('Change tab to files', function() {
    beforeEach(function() {
      cy
        .get("#workflow_tabs>ul")
          .children()
          .not(".active")
          .first()
          .next()
          .next()
          .click()
    });

    it('Should have Descriptor files tab selected', function() {
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

      describe('Change tab to Test Parameters', function() {
          beforeEach(function() {
            cy
              .get(".file-tabs")
                .children('div')
                .first()
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

  it('Change tab to tools', function() {
    cy
      .get("#workflow_tabs>ul")
        .children()
        .not(".active")
        .first()
        .next()
        .next()
        .next()
        .click()
  });

  describe('Change tab to dag', function () {
    beforeEach(function() {
      cy
        .get("#workflow_tabs>ul")
          .children()
          .not(".active")
          .first()
          .next()
          .next()
          .next()
          .next()
          .click()
    });

    it('Change to fullscreen and back', function() {
      cy
        .get("#dag_fullscreen")
          .click()
          .get("#dag-col")
            .should("have.class", "fullscreen-element")
            .get("#dag_fullscreen")
              .click()
              .should("not.have.class", "fullscreen-element")
    });
  });
})
