const userName = 'user@mail.com'
const password = 'abcd1234#'


// Login form
const form = document.querySelector('form');

if (form) {
    form.addEventListener('submit', function (e) {


        const user = document.getElementById('userName').value;
        const pass = document.getElementById('password').value;


        if (user === userName && pass === password) {

            localStorage.setItem('username', userName);

            // Go to Home Page
            window.location.href = 'index.html';

        } else {

            const error = document.getElementById('error');
            error.innerText = 'Invalid Username or Password.';

            setTimeout(function () {
                error.innerText = '';
            }, 2000);

        }

        e.preventDefault();
    });
}

function verify() {

    if (localStorage.getItem('username') !== null) {
        window.location.href = 'index.html';
    }
}

function reverseVerify() {

    if (localStorage.getItem('username') === null) {
        window.location.href = 'login.html';
    }
}

function logOut () {
    localStorage.clear();
    
    window.location.href = 'login.html';
}


const xhr = new XMLHttpRequest();

xhr.open('GET','https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.clubs.json', true);

xhr.onload = function () {
    if(this.status === 200) {
        const response = JSON.parse(this.responseText);
        
        let output = '';
        response.clubs.forEach(function(club) {
            output += `<li><a id="${club.code}" class="clubLink" onclick="getClubData(this)">${club.name}</a></li>`;
        });

        document.getElementById('clubName').innerHTML = output;
    }
}

xhr.send();



function getClubData(ele) {

    const club = new XMLHttpRequest();

    club.open('GET', 'https://raw.githubusercontent.com/openfootball/football.json/master/2019-20/en.1.json?_start=0&_limit=5', true);

    club.onload = function () {
        if(this.status === 200) {
            const response = JSON.parse(this.responseText);

            let newArray = response.matches.filter(function(team) {
                return (team.team1 == ele.innerText) || (team.team2 == ele.innerText);
            });

            localStorage.setItem('teamResults', JSON.stringify(newArray));

            window.location.href = 'club.html';

        }
    }
    
    club.send();

}

function getData() {
    let data = JSON.parse(localStorage.getItem('teamResults'));

    let newData = data.slice(0, 5);

    let output = '';
    newData.forEach(function(id) {
        output += `<div class="match">
                        <h3>${id.round}</h3>
                        <h3>${id.date}</h3>
                        <h1>${id.team1} : <span class="score">${id.score.ft}</span> : ${id.team2}</h1>
                    </div>`;
    });

    document.getElementById('club-result').innerHTML = output;
    
}

function viewMore() {
    let noOfDivs = document.getElementsByClassName('match').length;

    let data = JSON.parse(localStorage.getItem('teamResults'));

    let moreData = data.slice(noOfDivs, noOfDivs+5);

    let totalDivs = data.length;

    let vm = document.getElementById('viewbtn');

    let output = '';
    moreData.forEach(function(id) {
        output += `<div class="match">
                        <h3>${id.round}</h3>
                        <h3>${id.date}</h3>
                        <h1>${id.team1} : <span class="score">${id.score.ft}</span> : ${id.team2}</h1>
                    </div>`;
    });

    document.getElementById('club-result').innerHTML += output;

    if(noOfDivs+5 >= totalDivs) {
        vm.style.display = "none";
    }
}


const match = new XMLHttpRequest();

match.open('GET','https://raw.githubusercontent.com/openfootball/football.json/master/2019-20/en.1.json', true);

match.onload = function () {
    if(this.status === 200) {
        const response = JSON.parse(this.responseText);

        let array = response.matches.map(function(match) {
            return match.round;
        });

        let set = new Set(array);

        let newArray = Array.from(set);

        let output = '';
        newArray.forEach(function(mday) {
            output += `<li><a id="${mday}" class="clubLink" onclick="getMatchDetails(this)">${mday}</a></li>`;
        });

        document.getElementById('matchday').innerHTML = output;
    }
}

match.send();

function getMatchDetails (ele) {

    const club = new XMLHttpRequest();

    club.open('GET', 'https://raw.githubusercontent.com/openfootball/football.json/master/2019-20/en.1.json', true);

    club.onload = function () {
        if(this.status === 200) {
            const response = JSON.parse(this.responseText);

            let newArray = response.matches.filter(function(team) {
                return team.round == ele.innerText;
            });

            localStorage.setItem('matchResults', JSON.stringify(newArray));

            window.location.href = 'match.html';

        }
    }
    
    club.send();
}

function getMatchData() {
    let data = JSON.parse(localStorage.getItem('matchResults'));

    let output = '';
    data.forEach(function(id) {
        output += `<div class="match">
                        <h3>${id.round}</h3>
                        <h3>${id.date}</h3>
                        <h1><a class="clubLink" onclick="getClubData(this)">${id.team1}</a> : <span class="score">${id.score.ft}</span> : <a class="clubLink" onclick="getClubData(this)">${id.team2}</a></h1>
                    </div>`;
    });

    document.getElementById('match-result').innerHTML = output;
}