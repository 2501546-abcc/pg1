// 睡眠記録を格納する配列を宣言
let sleepRecords=[];

// ページ読み込み時に実行する初期化関数
function initialize(){

    // localStorageから保存済みの睡眠データを取得
    let storedData = localStorage.getItem("sleepRecords");

    // データが存在する場合、JSON文字列を配列に変換
    if(storedData != null){
        sleepRecords=JSON.parse(storedData);
    }

    // 各入力フォームの要素を取得
    let dateElem = document.getElementById("date");
    let sleepTimeElem = document.getElementById("sleepTime");
    let wakeTimeElem = document.getElementById("wakeTime");
    let moodElem = document.getElementById("mood");
    let qualityElem = document.getElementById("quality");
    let alarmRadiosElem = document.getElementsByName("alarm");
    let napRadiosElem = document.getElementsByName("nap");
    let alarmTimeElem = document.getElementById("alarmTime");
    let addBtn = document.getElementById("addButton");

    // 入力欄が変化したらボタンの状態を更新
    dateElem.addEventListener("input",function(){
        updateButton();
    });

    sleepTimeElem.addEventListener("input",function(){
        updateButton();
    });

    wakeTimeElem.addEventListener("input",function(){
        updateButton();
    });

    moodElem.addEventListener("input",function(){
        updateButton();
    });

    qualityElem.addEventListener("input",function(){
        updateButton();
    });

    alarmTimeElem.addEventListener("input",function(){
        updateButton();
    });

    // ラジオボタンが変化したらボタンの状態を更新
    for(let elem of alarmRadiosElem){
        elem.addEventListener("change",function(){
            updateButton();
        });
    }

    for(let elem of napRadiosElem){
        elem.addEventListener("change",function(){
            updateButton();
        });
    }

    // 追加ボタンがクリックされた時の処理
    addBtn.addEventListener("click",function(){

        // デバッグ用ログ
        console.log("ボタンが押された");

        // 入力値を取得
        let date = dateElem.value;
        let sleepTime = sleepTimeElem.value;
        let wakeTime = wakeTimeElem.value;
        let mood = moodElem.value;
        let quality = qualityElem.value;

        // アラームラジオボタンの選択値を取得
        let alarmValue = "";
        for(let elem of alarmRadiosElem){

            // 選択されていれば処理
            if(elem.checked == true){

                // 値を取得
                alarmValue = elem.value;

                // 見つかったら終了
                break;
            }
        }

        // 昼寝ラジオボタンの選択値を取得
        let napValue = "";
        for(let elem of napRadiosElem){

            // 選択されていれば処理
            if(elem.checked == true){

                // 値を取得
                napValue = elem.value;

                // 見つかったら終了
                break;
            }
        }

        // アラーム時刻とメモの値を取得
        let alarmTime = alarmTimeElem.value;
        let memo = document.getElementById("memo").value;

        // 睡眠時間を計算
        let sleepDuration = calculateSleepDuration(sleepTime,wakeTime);

        // 1件分の睡眠記録オブジェクトを作成
        let sleepRecord = {
            date: date,
            sleepDuration: sleepDuration,
            mood: mood,
            quality: quality,
            alarm: alarmValue,
            alarmTime: alarmTime,
            nap: napValue,
            memo: memo
        };

        // 配列に追加
        sleepRecords.push(sleepRecord);

        // localStorageに保存（文字列化）
        localStorage.setItem("sleepRecords",JSON.stringify(sleepRecords));

        // デバッグ用ログ
        console.log(sleepRecords);

        // 入力欄を初期化
        dateElem.value = "";
        sleepTimeElem.value = "";
        wakeTimeElem.value = "";
        moodElem.value = "";
        qualityElem.value = "";
        alarmTimeElem.value = "";
        for(let elem of alarmRadiosElem){
            elem.checked=false;
        }
        for(let elem of napRadiosElem){
            elem.checked=false;
        }
        document.getElementById("memo").value = "";

        // 記録一覧ページに遷移
        window.location.href = "list.html";
    });

    // 初回ボタン状態を更新
    updateButton();
}

// ボタンを有効/無効にする関数
function updateButton(){

    // 追加ボタン取得
    let addBtn = document.getElementById("addButton");

    // 入力値を取得
    let date = document.getElementById("date").value;
    let sleepTime = document.getElementById("sleepTime").value;
    let wakeTime = document.getElementById("wakeTime").value;
    let mood = document.getElementById("mood").value;
    let quality = document.getElementById("quality").value;
    let alarmRadios = document.getElementsByName("alarm");
    let napRadios = document.getElementsByName("nap");
    let alarmTime = document.getElementById("alarmTime").value;

    // アラームラジオの選択値取得
    let alarmValue = "";
    for(let a of alarmRadios){
        if(a.checked == true){
            alarmValue = a.value;
            break;
        }
    }

    // 昼寝ラジオの選択値取得
    let napValue = "";
    for(let n of napRadios){
        if(n.checked == true){
            napValue = n.value;
            break;
        }
    }

    // 空欄がある場合はボタンを無効化
    if(date == "" || sleepTime == "" || wakeTime == "" || mood == "" || quality == "" || alarmValue == "" || napValue == ""){
        addBtn.disabled = true;
        return;
    }

    // アラーム使用と未使用時の条件チェック
    if((alarmValue == "使用" && alarmTime == "") || (alarmValue == "未使用" && alarmTime != "")){
        addBtn.disabled = true;
        return;
    }

    // 条件を満たしていればボタン有効化
    addBtn.disabled = false;
}

// 就寝時刻と起床時刻から睡眠時間を計算（AIを使った）
function calculateSleepDuration(sleepTime,wakeTime){

    // HH:MMを分割
    let sleepParts = sleepTime.split(":");
    let wakeParts = wakeTime.split(":");

    // 分換算
    let sleepMinutes = Number(sleepParts[0]) * 60 + Number(sleepParts[1]);
    let wakeMinutes = Number(wakeParts[0]) * 60 + Number(wakeParts[1]);

    // 時間差計算
    let diff = wakeMinutes - sleepMinutes;

    // 日跨ぎの場合調整
    if(diff < 0){
        diff += 24 * 60;
    }

    // 時間部分
    let hours = Math.floor(diff / 60);

    // 分部分
    let minutes = diff % 60;

    // 文字列にして返す
    return hours + "時間" + minutes + "分";
}

// ページ読み込み時に初期化関数を実行
window.onload = initialize;