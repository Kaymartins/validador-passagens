document.addEventListener('DOMContentLoaded', function () {
    // Obter o parâmetro da URL
    const urlParams = new URLSearchParams(window.location.search);
    const validationCode = urlParams.get('validationCode');

    // Verificar se o parâmetro está presente
    if (validationCode) {
        const apiEndpoint = `https://levty-treinamento-inicial.sydle.one/api/1/airlineTripsInformations/airlinesTicketKayanFreitas/airlineTicket/getInfos?validationCode=${validationCode}`;


        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                // Verificar se a passagem foi encontrada
                if (data) {
                    displayResult(true, data, validationCode);
                } else {
                    displayResult(false);
                }
            })
            .catch(error => {
                console.error('Erro ao obter dados da API:', error);
                displayResult(false);
            });
    } else {
        // Se o parâmetro não estiver presente, exibir mensagem de erro
        displayResult(false);
    }
});

function displayResult(isValid, data, validationCode) {
    const resultDiv = document.getElementById('result');
    const downloadMethod = `downloadPassagem('${validationCode}')`;

    if (isValid) {
        resultDiv.innerHTML = `
            <div class="result-table">
                <h2>Resultado:</h2>
                <table>
                    <tr>
                        <th>Origem</th>
                        <th>Destino</th>
                        <th>Horario</th>
                    </tr>
                    <tr>
                        <td>${data.origem}</td>
                        <td>${data.destino}</td>
                        <td>${data.horario}</td>
                    </tr>
                    <tr>
                        <th>Embarque</th>
                        <td colspan="3">${data.embarque}</td>
                    </tr>
                    <tr>
                        <th>Desembarque</th>
                        <td colspan="3">${data.desembarque}</td>
                    </tr>
                </table>
            </div>
            <div class="download-button-container">
                <button class="download-button" onclick="${downloadMethod}">Baixar Passagem</button>
            </div>


        `;
    } else {
        resultDiv.innerHTML = `
            <p>
                <div><i class="fas fa-exclamation-triangle error-icon"></i></div>
                <div class="error-message">Passagem não encontrada ou código inválido.</div>
            </p>`;
    }
}

function downloadPassagem(validationCode) {
    const apiUrl = `https://levty-treinamento-inicial.sydle.one/api/1/airlineTripsInformations/airlinesTicketKayanFreitas/airlineTicket/getTicket?validationCode=${validationCode}`;
    // Fazer uma nova requisição à API para obter a passagem em PDF
    console.log(apiUrl);
    fetch(apiUrl)
        .then(response => response.blob())
        .then(blob => {
            // Criar um link para o blob e simular o download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'passagem.pdf';
            link.click();
        })
        .catch(error => {
            console.error('Erro ao baixar a passagem:', error);
            alert('Erro ao baixar a passagem. Por favor, tente novamente.');
        });
}