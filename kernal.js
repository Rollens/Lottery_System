var NameList;
var Winner=[];
var speed = 10;
var oldguys = 350;
var isClick=true;
var Slow_Mode=false;
var showInfoDelatTime = 4500;
var last5 = false;
var rego = false;


window.onload = function() {
    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;
        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                let farray = reader.result.split('\r\n');
                let temp = new Array(farray.length)
                for(var i = 0 ; i < farray.length ; i++){
                    temp[i] = farray[i].split(',');
                }
                NameList=temp
            }
            $('#LoadList').css("visibility","hidden");
            reader.readAsText(file);
        }
    });
}

function getRandomInt(max,old) {
    if(old){
        return Math.floor(Math.random() * (max-oldguys))}
    else{
        return Math.floor(Math.random() * max);}
}
function getRandomInt_Digit() {
        return Math.floor(Math.random()*9)
}

var app = new Vue({
    el:"#container", 
    data:{
      WinnerID: '中獎工號',
      WinnerDept:'部門',
      WinnerChineseName:'中獎姓名',
      WinnerEnglishName:'中獎英文名',
      UnfairFlag:false,
      FirstGo:true,
      MutilWinner:[],
      PriceID:250
    },
    methods:{
        Lottery(e){
            if(isClick && e.keyCode == 220){
                if(this.FirstGo){
                    this.FirstGo=false;
                }
                else if (!rego){
                    this.PriceID -= 1;
                };
                if (this.PriceID<=0){
                    document.getElementById('ShowPriceID').innerHTML = '現在是加碼時間！！！'
                }
                isClick=false;
                var thewinner;
                $('#WinnerInfo').hide();
                $('#waiting').css('display','flex');
                $('#MotionHolder').show();
                $('#MutilCong').hide()
                thewinner = getRandomInt(NameList.length,this.PriceID<=25);
                if (thewinner < oldguys){
                    oldguys -= 1
                };
                DigitGo(NameList[thewinner][0],last5)
                setTimeout(()=>{
                    this.WinnerID = NameList[thewinner][0];
                    this.WinnerDept = NameList[thewinner][1];
                    this.WinnerChineseName = NameList[thewinner][2];
                    this.WinnerEnglishName = NameList[thewinner][3];
                    isClick=true;
                    NameList
                    $('#WinnerInfo').css('display','flex');
                    $('#waiting').css('display','none');
                    NameList[thewinner].splice(0,0,this.PriceID);
                    Winner.push(NameList[thewinner]);
                    NameList.splice(thewinner,1);
                    rego = false;
                    },showInfoDelatTime);
                }
            },// Lottery結尾
            ToCsv(e){
                if (isClick && e.keyCode == 83){
                    console.log('Store_NameList')
                    StorageNameList();}
            },
            ToCsv_Winner(e){
                if (isClick && e.keyCode == 87){
                    console.log('Store_Winner')
                    StorageWinner();}
            },
            SlowShow(e){
                if(isClick && e.keyCode == 221){
                    if (!Slow_Mode){
                        showInfoDelatTime = 7000;
                        last5 = true;
                        console.log('Slow Mode On');
                        Slow_Mode = true
                    }
                    else{
                        showInfoDelatTime = 4500;
                        last5 = false;
                        console.log('Slow Mode Off');
                        Slow_Mode = false
                    }
                }
            },
            ReTake(e){
                if(isClick && e.keyCode == 82){
                    rego = true;
                    Winner.splice(Winner.length-1,1)
                    document.getElementById('dg1').innerHTML = '重';
                    document.getElementById('dg2').innerHTML = '新';
                    document.getElementById('dg3').innerHTML = '抽';
                    document.getElementById('dg4').innerHTML = '獎';
                }
            }
        }
    }
  );

window.addEventListener('keydown',(e)=>{app.Lottery(e);app.ToCsv(e);app.ToCsv_Winner(e);app.SlowShow(e);app.ReTake(e);})

function DigitGo(target,last){
    let tg1,tg2,tg3,tg4;
    tg1 = ~~(target/1000);
    tg2 = ~~(target%1000/100);
    tg3 = ~~(target%1000%100/10);
    tg4 = ~~(target%1000%100%10);
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    const spd = 40;
    let finalDg1 = last ? 75 : 50;
    let finalDg2 = last ? 100 : 63;
    let finalDg3 = last ? 130 : 76;
    let finalDg4 = last ? 160 : 100;
    let go = setInterval(()=>{
        d1 = getRandomInt_Digit()
        document.getElementById('dg1').innerHTML = d1
        counter1 ++;
        if (counter1 >finalDg1){
            document.getElementById('dg1').innerHTML = tg1
            clearInterval(go)
        };
    },spd)
    let go2 = setInterval(()=>{
        d2 = getRandomInt_Digit()
        document.getElementById('dg2').innerHTML = d2
        counter2 ++;
        if (counter2 >finalDg2){
            document.getElementById('dg2').innerHTML = tg2
            clearInterval(go2)
        };
    },spd)
    let go3 = setInterval(()=>{
        d3 = getRandomInt_Digit()
        document.getElementById('dg3').innerHTML = d3
        counter3 ++;
        if (counter3 >finalDg3){
            document.getElementById('dg3').innerHTML = tg3
            clearInterval(go3)
        };
    },spd)
    let go4 = setInterval(()=>{
        d4 = getRandomInt_Digit()
        document.getElementById('dg4').innerHTML = d4
        counter4 ++;
        if (counter4 >finalDg4){
            document.getElementById('dg4').innerHTML = tg4
            clearInterval(go4)
        };
    },spd)
};
function StorageWinner(){
    let csvContent = "data:text/csv;charset=utf-8,";
    Winner.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");

    var filename = Date.now().toString()
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename+"_Winner.csv");
    document.body.appendChild(link); // Required for FF
    link.click(); // This will download the data file named "my_data.csv".
};
function StorageNameList(){
    let csvContent = "data:text/csv;charset=utf-8,";
    NameList.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");

    var filename = Date.now().toString()
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename+"_NameList.csv");
    document.body.appendChild(link); // Required for FF
    link.click(); // This will download the data file named "my_data.csv".
};

