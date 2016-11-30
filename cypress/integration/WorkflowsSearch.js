
describe('Dockstore workflow search page', function() {

	beforeEach(function () {
     cy.visit("http://localhost:9000/search-workflows")
  });

   describe('Select a workflow', function() {
     it('Should have one workflow (and a hidden row)', function() {
       cy
         .get('tbody')
         .children('tr')
         .should('have.length', 2)
     });

     it('Select test_workflow_cwl', function() {
       var toolpath = cy
         .get('tbody')
         .children('tr')
         .first()
         .find('a')
         .first()
         .click()
         .get('#workflow-path')
         .should('contain.text', 'DockstoreTestUser2/test_workflow_cwl ')
     });
   });
})
