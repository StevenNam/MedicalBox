angular.module('starter.services', [])

  /**
   * 名稱: Validation
   * 建立日期: 2016-02-20
   * 出現版本: 1.0
   */
  .factory('Validation', function () {

    function SignIn () {
      this.email = "";
      this.password = "";

      this.getJSON = function () {
        return {
          email: this.email,
          password: this.password
        }
      }
    }

    function SignUp () {
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
      this.name = "";
      this.age = "";

      this.getJSON = function () {
        return {
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
          name: this.name,
          age: parseInt(this.age, 10)
        }
      }
    }

    return {
      createSignInForm: function () {
        return new SignIn();
      },

      createSignUpForm: function () {
        return new SignUp();
      }

    }
  })

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });
