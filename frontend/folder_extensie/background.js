// let color = '#3aa757';

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color });
//   console.log('Default background color set to %cgreen', `color: ${color}`);
// });

// function CallClientOM() {
//   var context = new SP.ClientContext.get_current();
//   this.website = 'https://www.emag.ro/';
//   this.currentUser = website.get_currentUser();
//   context.load(currentUser);
//   context.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
// }

// function onQuerySucceeded(sender, args) {
//   alert(currentUser.get_loginName());
// }



// function onQueryFailed(sender, args) {
//   alert('request failed ' + args.get_message() + '\n' + args.get_stackTrace());
// }


// program to generate random strings

// declare all characters

function generateString(length) {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// function getUserCode() {
//   if (chrome.storage.local.get('code') === null) {
//     var newCode = generateString(20);
//     chrome.storage.local.set({ 'code': newCode }, function () {
//       console.log('Settings saved');
//       return newCode;
//     });
//   }
//   else {
//     chrome.storage.local.get(['code'], function (result) {
//       var code = result.code;
//       console.log('Code ' + code + ' is in storage');
//       return code;
//     });
//   }
// }

function getUserCode() {
  return new Promise(function (resolve, reject) {
    if (chrome.storage.local.get('code') === null) {
      var newCode = generateString(20);
      chrome.storage.local.set({ 'code': newCode }, function () {
        console.log('Settings saved');
        //return newCode;
      });
    }
    else {
      chrome.storage.local.get(['code'], function (result) {
        var code = result.code;
        console.log('Code ' + code + ' is in storage');
        return code;
      });
    }
  });
}


