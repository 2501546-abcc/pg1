// 保存済み睡眠記録を格納する配列
let sleepRecords = [];

// 記録一覧を表示する関数
function displayRecords(){

    // tbody要素を取得
    let listBody = document.getElementById("list");

    // 既存の行を削除（初期化）
    while(listBody.firstElementChild){
        listBody.removeChild(listBody.firstElementChild);
    }

    // localStorageから記録を取得
    let storedData = localStorage.getItem("sleepRecords");
    if(storedData != null){

        // JSON文字列を配列に変換
        sleepRecords = JSON.parse(storedData);
    }

    // 配列をループして行を作成
    for(let i = 0; i < sleepRecords.length; i++){

        // 1件取得
        let record = sleepRecords[i];

        // tr要素作成
        let tr = document.createElement("tr");

        // trの中身を設定
        tr.innerHTML =
            "<td>" + record.date + "</td>" +
            "<td>" + record.sleepDuration + "</td>" +
            "<td>" + record.mood + "</td>" +
            "<td>" + record.quality + "</td>" +
            "<td>" + record.alarm + record.alarmTime + "</td>" +
            "<td>" + record.nap + "</td>" +
            "<td>" + record.memo + "</td>";

        // 削除ボタンのセルを作成
        let deleteTd = document.createElement("td");

        // ボタン作成
        let deleteBtn = document.createElement("button");

        // 表示文字
        deleteBtn.textContent = "削除";

        // イベントリスナーを設定する
        deleteBtn.addEventListener("click", function(){

            // 配列から削除
            sleepRecords.splice(i, 1);

            // localStorage更新
            localStorage.setItem("sleepRecords", JSON.stringify(sleepRecords));

            // 再描画
            displayRecords();
        });

        // trに削除ボタンセルを追加
        deleteTd.appendChild(deleteBtn);
        tr.appendChild(deleteTd);

        // tbodyに行を追加
        listBody.appendChild(tr);
    }
}

// ページ読み込み時に表示関数を実行
window.onload = displayRecords;