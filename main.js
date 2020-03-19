window.onload = function() {
    let reqTranslate = new XMLHttpRequest(); 
    let API_KEY = 'trnsl.1.1.20200211T100844Z.c11a59dc9d0fc78e.90d8de4efb10e68ce64993e890eb797bf3163d6b';
  
    let urlTranslate = 'https://translate.yandex.net/api/v1.5/tr.json/translate' + '?key=' + API_KEY; 
    let urlInputLang = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs' + '?key=' + API_KEY + '&ui=' + 'en'; 
    let urlOutputLang = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs' + '?key=' + API_KEY;
  
    let wordForTranslateElem = document.querySelector('.word-for-translate'); 
    let choiseInputLang = document.querySelector('.list-input-lang'); 
    let choiseOutputLang = document.querySelector('.list-output-lang'); 
    let langInputSelected;                                           
    let langOutputSelected;                                          

    let dictInput = {};      
    let dictOutput = {};      

    function getInputLangs() {
      let responseInputLang = JSON.parse(reqTranslate.response); 

      choiseInputLang.append(document.createElement('option')); 
      for (const i in responseInputLang['langs']) {
        dictInput[responseInputLang['langs'][i]] = i;

        let inputLangListItem = document.createElement('option');
        inputLangListItem.innerHTML = `${responseInputLang['langs'][i]}`;
        choiseInputLang.append(inputLangListItem);
       }
       reqTranslate.removeEventListener('load',getInputLangs);
    }
    reqTranslate.addEventListener('load',getInputLangs);
    reqTranslate.open('get', urlInputLang);
    reqTranslate.send(); 
  
    function getOutputLangs () {
          
      let responseOutputLang = JSON.parse(reqTranslate.response);
      for (const i in responseOutputLang['langs']) {
        dictOutput[responseOutputLang['langs'][i]] = i; 
        let outputLangListItem = document.createElement('option');
        outputLangListItem.innerHTML = `${responseOutputLang['langs'][i]}`;
        choiseOutputLang.append(outputLangListItem);
      }
    }
    choiseInputLang.addEventListener('change', function() {
  
      langInputSelected = dictInput[choiseInputLang.value]; 
      urlOutputLang += '&ui=' + langInputSelected;

        if (choiseOutputLang.innerHTML.length === 0) {
          reqTranslate.addEventListener('load',getOutputLangs)
          reqTranslate.open('get',urlOutputLang);
          reqTranslate.send();
      }  
    });
    let sendForm = document.querySelector('.send-form');
    sendForm.addEventListener('submit', function(ev) {
        ev.preventDefault();
        reqTranslate.removeEventListener('load',getOutputLangs);
        let wordForTranslate = wordForTranslateElem.value;
        let translate = document.querySelector('.translate'); 
     
        langOutputSelected = dictOutput[choiseOutputLang.value]; 
        
        urlTranslate += `&text=${wordForTranslate}`; 
        urlTranslate += `&lang=${langInputSelected}-${langOutputSelected}`; 
        
        reqTranslate.addEventListener('load', function () {
          console.log(reqTranslate.response); 
          let response = JSON.parse(reqTranslate.response); 
        
          if (response.code !== 200) {
            translate.innerHTML = 'Произошла ошибка при получении ответа от сервера:\n\n' + response.message;
            return;
          }
          if (response.text.length === 0) {
            translate.innerHTML = 'К сожалению, перевод для данного слова не найден';
            return;
          }
          translate.innerHTML = response.text.join('<br>'); 
        });
        reqTranslate.open('get', urlTranslate);
        reqTranslate.send(); 
        urlTranslate = 'https://translate.yandex.net/api/v1.5/tr.json/translate' + '?key=' + API_KEY; 
    });
  };