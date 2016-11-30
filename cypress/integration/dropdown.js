
describe('Dropdown test', function() {

	beforeEach(function () {
	  // Login by adding user obj and token to local storage
	  localStorage.setItem('dockstore.ui.userObj', '{\"id\": 1, \"username\": \"DockstoreTestUser2\", \"isAdmin\": \"false\", \"name\": \"DockstoreTestUser2\"}')
    localStorage.setItem('satellizer_token', 'fasfsefse')
    cy.visit("http://localhost:9000")

     // Select dropdown
     cy
        .get('#dropdown-main')
        .click()
  });

    describe('Go to accounts page', function() {
      beforeEach(function() {
        // Select dropdown
        cy
          .get('#dropdown-accounts')
          .click()
      });

      it('Should show all accounts as linked', function(){

      });
    });
});
