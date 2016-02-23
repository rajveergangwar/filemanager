var express             = require('express');
var fs                  = require('fs');
var url                 = require('querystring');
var bodyParser          = require('body-parser');
var path                = require('path')
var LineByLineReader    = require('line-by-line');


var app = express();
var innerFol = [];
var real_data = [];
app.set("view engine", 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/*', function (req, res) {
    if (req.query.editFile) {
        fs.readFile(req.query.editFile, function (err, contents) {
            if (!err) {
                var fileDetails = {
                    'url': req.query.editFile
                };
                var arr = req.url.toString().split("/");
                delete  arr[''];
                delete  arr['?editFile='];
                console.log(arr);
                res.render('editContent', {'data': contents, 'fileDetails': fileDetails,'message':'','currentUrl':req.url,'brd':arr})
            }
        });
    } else {
        fs.readdir(req.url, function (err, files) {
            if (err) {
                console.log('error found' + err);
                return;
            } else {
                try {
                    if (req.url == '/') {
                        var arr = req.url.toString().split("/");
                        res.render('default', {'data': files, 'inner': false,'brd':arr,'currentUrl':req.url})
                    } else {
                        if (real_data.length != 0) {
                            real_data = [];
                        }
                        for (i = 0; i < files.length; i++) {
                            var obj = new Object;
                            obj.Url = req.url + '/' + files[i];
                            obj.Name = files[i];
                            stats = fs.lstatSync(obj.Url);
                            if (stats.isDirectory()) {
                                obj.isDir = true;
                                obj.isFile = false;
                            }
                            if (stats.isFile()) {
                                obj.isDir = false;
                                obj.isFile = true;
                            }
                            real_data.push(obj);
                        }
                        var arr = req.url.toString().split("/");
                        res.render('default', {'data': real_data, 'inner': true,'brd':arr,'currentUrl':req.url});
                        console.log(real_data);
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
    }
});

app.post('/saveFile', function (req, res) {
    var newContent = req.body.code;
    var fileUrl = req.body.fileUrl;
    fs.readFile(fileUrl, 'utf-8', function (err, data) {
        if (err)
            throw err;
        var newValue = data.replace(/^\./gim, newContent);
        fs.writeFile(fileUrl, newContent, 'utf-8', function (err) {
            if (err)
                throw err;
            else {
                fs.readFile(fileUrl, function (err, contents) {
                    if (!err) {
                        var fileDetails = {
                            'url': fileUrl
                        };
                        res.redirect(req.get('referer'));
                    }
                });
            }
        });
    });
});

app.post('/createNewFile',function (req,res){
   var fileName =   req.body.fileName;
   var dir      =   req.body.DirectoryName;
   if(fileName.length==0) {
       res.end("Please enter file name");
   } else {
       if(path.extname(fileName).length==0) {
           res.send("Please enter extension for file name too");
       } else {
           var fileNamewithLoction    =   dir+'/'+fileName;
            fs.writeFile(fileNamewithLoction, "create file"+fileNamewithLoction, function(err) {
                if(err) {
                    return console.log(err);
                }
                res.redirect('/?editFile='+fileNamewithLoction);
            }); 
       }
   }
});

app.post('/createNewDir',function (req,res){
   var dirName      =   req.body.dirName;
   var dir          =   req.body.DirectoryName;
   if(dirName.length==0) {
       res.end("Please Enter Directory Name");
   } else {
           var dirNamewithLoction    =   dir+'/'+dirName;
            fs.mkdir(dirNamewithLoction, function(err) {
                if(err) {
                    if(err.code=='EEXIST') {
                        res.end("Directory Already exists");
                    } else {
                        res.end(err);
                    }
                }
                res.redirect(dirNamewithLoction);
            }); 
   }
});

app.post('/deleteFile',function(req,res){
    var fileToDelete    =   req.body.DirectoryName;
    var currentUrl    =   req.body.currentUrl;
    if(path.extname(fileToDelete).length==0) {
        res.send("This is not a valid file");
    } else {
         fs.unlink(fileToDelete, function(err) {
             if(err) {
                 res.send(err);
             }
             res.end('file has been deleted');
         }); 
    }
});

app.listen("3000", function (req, res) {
    console.log("running on port 3000");
});