function printFunction(id) {
    // var prtContent = document.getElementById(id);
    // var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    
    // WinPrint.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
    
    // // To keep styling
    // var file = WinPrint.document.createElement("link");
    // file.setAttribute("rel", "stylesheet");
    // file.setAttribute("type", "text/css");
    // file.setAttribute("href", 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
    // WinPrint.document.head.appendChild(file);

    // WinPrint.document.write(prtContent.innerHTML);
    // WinPrint.document.close();
    // WinPrint.setTimeout(function(){
    //   WinPrint.focus();
    //   WinPrint.print();
    //   WinPrint.close();
    // }, 1000);   

    //

    // var print = document.createElement('button')
    // var canvas = document.createElement('canvas')
    // var ctx = canvas.getContext('2d')

    // canvas.width = 300;
    // canvas.height = 100;

    // ctx.fillStyle = '#000'
    // ctx.font = '15px sans-serif'
    // ctx.fillText('Canvas content ... print', 10, 20)

    // document.getElementById(id).appendChild(canvas)

    printJS(id, 'html')
    
             
}


// Quick and simple export target #table_id into a csv
function exportCSV(table_id, fname) {
    // Select rows from table_id
    var rows = document.querySelectorAll('table#' + table_id + ' tr');
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(';'));
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = fname + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}