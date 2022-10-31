const fs = require("fs");

fs.writeFile("text.txt", "Текст", function(err){
    if (err) {
        console.log(err);
    } else {
        console.log("Файл создан");
    }
});