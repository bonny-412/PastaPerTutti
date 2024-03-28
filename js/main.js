// IEFE
(() => {

    window.addEventListener('blur', () => {
        document.title = 'Pesa altra pasta 😞';
    });

    window.addEventListener('focus', () => {
        document.title = 'Pasta Per Tutti';
    });

    
    // ui variables
    const personeList = document.querySelector("#personeList");
    const containerResultList = document.querySelector("#containerResultList");
    const buttonAddPersona = document.querySelector('#addPersona');
    const buttonCalcolaPorzioni = document.querySelector('#calcolaPorzioni');
    const pesoPastaCottaTot = document.querySelector('#pesoPastaCottaTot');
    const logo = document.querySelector('#logo');

    creaListaPersoneAvvioApp();

    // event listeners
    logo.addEventListener('clicl', e => {
        window.location.reload();
    });

    buttonAddPersona.addEventListener('click', e => {
        e.preventDefault();
        addItemToDOM();
    });

    buttonCalcolaPorzioni.addEventListener('click', e => {
        let pesoPastaCottaTotVal = 0;
        let totalePastaCrudaPersone = 0;
        let isError = false;
        
        if(pesoPastaCottaTot.value != "" && 
        pesoPastaCottaTot.value != null) {
            pesoPastaCottaTotVal = parseInt(pesoPastaCottaTot.value);
        }else {
            pesoPastaCottaTot.classList.add('blink');
                setTimeout(function() {
                    pesoPastaCottaTot.classList.remove('blink');
                }, 3000);
            isError = true;
        }

        personeList.querySelectorAll('div').forEach((elm, index) => {
            const inputs = elm.querySelectorAll('.form__input');

            inputs.forEach(input => {
                if(input.value == "" || input.value == null) {
                    input.classList.add('blink');
                    setTimeout(function() {
                        input.classList.remove('blink');
                    }, 3000);
                    isError = true;
                }else {
                    if(input.classList.contains('number')) {
                        let pesoPastaCrudaApp = input.value;
                        pesoPastaCrudaApp = parseInt(pesoPastaCrudaApp);
                        totalePastaCrudaPersone = totalePastaCrudaPersone + pesoPastaCrudaApp;
                    }
                }
            });

        });

        if(!isError) {
            calcolaPorzioni(pesoPastaCottaTotVal, totalePastaCrudaPersone);
        }
    });

    personeList.addEventListener('click', function(event) {
        // Check if the clicked element is the button
        if (event.target.tagName === 'BUTTON') {
            const buttonElement = event.target;
            const idButtonElement = buttonElement.id.split('-')[1];

            removeItemFromDOM(idButtonElement);
        }
    });

    personeList.addEventListener('input', function(event) {
        if(event.target.classList.contains('number')) {
            event.target.value = event.target.value.replace(/[^0-9]/g, '');
        }
    });

    pesoPastaCottaTot.addEventListener('input', function(event) {
        if(event.target.classList.contains('number')) {
            event.target.value = event.target.value.replace(/[^0-9]/g, '');
        }
    });

    
    // functions
    function addItemToDOM(nomePersona) {
        const idDiv = personeList.getElementsByTagName('div').length + 1;
        const div = document.createElement('div');
        div.id = `div-${idDiv}`;
        div.classList.add('persone-list-item');

        const spanIdElement = document.createElement('span');
        spanIdElement.id = `spanPesoPastaCruda-${idDiv}`;
        spanIdElement.classList.add('span-peso-pasta-cruda');
        spanIdElement.textContent = idDiv;

        const newInputPesoPastaCruda = document.createElement('input');
        newInputPesoPastaCruda.type = 'text';
        newInputPesoPastaCruda.id = `pesoPastaCruda-${idDiv}`;
        newInputPesoPastaCruda.name = `pesoPastaCruda-${idDiv}`;
        newInputPesoPastaCruda.maxLength = 3;
        newInputPesoPastaCruda.placeholder = 'Peso pasta cruda (g)';
        newInputPesoPastaCruda.classList.add('form__input');
        newInputPesoPastaCruda.classList.add('number');

        const newInputNomePersona = document.createElement('input');
        newInputNomePersona.type = 'text';
        newInputNomePersona.id = `nomePersona-${idDiv}`;
        newInputNomePersona.name = `nomePersona-${idDiv}`;
        newInputNomePersona.placeholder = 'Nome';
        newInputNomePersona.classList.add('form__input');
        newInputNomePersona.classList.add('nome-persona');

        if(nomePersona) {
            newInputNomePersona.value = nomePersona;
        }

        // const newLabelNomePersona = document.createElement('label');
        // newLabelNomePersona.htmlFor = `nomePersona-${idDiv}`;
        // newLabelNomePersona.appendChild(document.createTextNode('Nome'));
        // newLabelNomePersona.classList.add('form__label');

        const buttonDeleteElement = document.createElement('button');
        buttonDeleteElement.id = `buttonDeleteElement-${idDiv}`;
        buttonDeleteElement.classList.add('button-delete');
        buttonDeleteElement.appendChild(document.createTextNode('x'));

        div.appendChild(spanIdElement);
        div.appendChild(newInputNomePersona);
        div.appendChild(newInputPesoPastaCruda);
        div.appendChild(buttonDeleteElement);

        personeList.appendChild(div);

        tooglePersoneList();
    }

    function removeItemFromDOM(id) {
        // get the list item by data ID
        var li = document.querySelector(`#div-${id}`);
        // remove list item
        personeList.removeChild(li);

        ricalcoloIdPersoneList();
        salvaPersone();
        tooglePersoneList();
    }

    function ricalcoloIdPersoneList() {
        personeList.querySelectorAll('div').forEach((divItem, index) => {
            const newId = index + 1;
            // Aggiorna l'ID dell'elemento li
            divItem.id = `div-${newId}`;

            // Aggiorna gli ID degli elementi interni
            const span = divItem.querySelector('.span-peso-pasta-cruda');
            const inputNome = divItem.querySelector('.nome-persona');
            const inputPesoPastaCruda = divItem.querySelector('.number');
            const button = divItem.querySelector('.button-delete');

            if (span) {
                span.textContent = newId;
                span.id = `spanPesoPastaCruda-${newId}`;
            }
                
            if (inputPesoPastaCruda) {
                inputPesoPastaCruda.id = `pesoPastaCruda-${newId}`;
                inputPesoPastaCruda.name = `pesoPastaCruda-${newId}`;
            }
            if (inputNome) {
                inputNome.id = `nomePersona-${newId}`;
                inputNome.name = `nomePersona-${newId}`;
            }
            if (button) button.id = `buttonDeleteElement-${newId}`;
        });

        tooglePersoneList();
    }

    function calcolaPorzioni(pesoPastaCottaTotVal, totalePastaCrudaPersone) {
        const rapportoPesoPastaCottaCruda = pesoPastaCottaTotVal / totalePastaCrudaPersone;
        const resultList = document.querySelector('#resultList');
        resultList.innerHTML = '';
        personeList.querySelectorAll('div').forEach((item, index) => {
            let pesoPastaCotta = 0;
            let value = item.querySelector('.number').value;
            if(value == "" || value == null) {
                value = 0;
            }
            value = parseInt(value);
            pesoPastaCotta = value * rapportoPesoPastaCottaCruda;
            pesoPastaCotta = Math.round(pesoPastaCotta);

            let nomePersona = item.querySelector('.nome-persona').value;

            const span = document.createElement('span');
            
            const spanNomePersona = document.createElement('span');
            spanNomePersona.classList.add('span-peso-pasta-cruda');
            spanNomePersona.textContent = nomePersona;

            const spanTestoNormale = document.createElement('span');
            spanTestoNormale.textContent = ` deve mangiare: `;

            const spanPesoPastaCotta = document.createElement('span');
            spanPesoPastaCotta.classList.add('result-peso-pasta-cotta');
            spanPesoPastaCotta.textContent = `${pesoPastaCotta}g`;

            span.appendChild(spanNomePersona);
            span.appendChild(spanTestoNormale);
            span.appendChild(spanPesoPastaCotta);
            resultList.appendChild(span);
        });

        containerResultList.classList.remove('hide');
        salvaPersone();
        document.getElementById('resultList').scrollIntoView();
    }

    //Salva un json con il nome delle persone
    function salvaPersone() {
        let arrayPersone = [];
        personeList.querySelectorAll('div').forEach((item, index) => {
            const nomePersona = item.querySelector('.nome-persona').value;
            arrayPersone.push({nome: nomePersona});
        });
        window.localStorage.setItem('pastaPerTuttiPersoneArray', JSON.stringify(arrayPersone));
    }

    function creaListaPersoneAvvioApp() {
        let arrayPersone = window.localStorage.getItem('pastaPerTuttiPersoneArray');
        if(arrayPersone) {
            arrayPersone = JSON.parse(arrayPersone);
            for(let i = 0; i < arrayPersone.length; i ++) {
                
                addItemToDOM(arrayPersone[i].nome);
            }
        }
        tooglePersoneList();
    }

    function tooglePersoneList() {
        if(personeList.querySelectorAll('div').length > 0) {
            personeList.classList.remove('hide');
            buttonCalcolaPorzioni.classList.remove('hide');
        }else {
            personeList.classList.add('hide');
            buttonCalcolaPorzioni.classList.add('hide');
        }
    }

})();