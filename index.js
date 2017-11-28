const express = require('express');
const { Pool, Client } = require('pg');
const app = express();
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'students',
    password: 'buianhtu',
    port: 5432,
})

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(3000, () => { console.log("Server is running on port 3000") });

app.get("/", (req, res) => {
    pool.connect((err, client, done) => {
        if (err) { console.log(err) } else {
            client.query('SELECT * FROM sinhvien', (err, result) => {
                done();
                if (err) {
                    res.end();
                    console.log(err.stack)
                } else {
                    res.render("sinhvien_list", { sinhviens: result });
                }
            });
        }
    });
});

app.get('/sinhvien/them', (req, res) => {
    res.render("sinhvien_insert");
})

app.post("/sinhvien/them", urlencodedParser, (req, res) => {
    if (!req.body) { return res.sendStatus(400); }
    else {
        pool.connect((err, client, done) => {
            if (err) { console.log(err) } else {
                let hoten = req.body.txtHoTen;
                let email = req.body.txtEmail;
                client.query("insert into sinhvien(hoten,email) values('"+hoten+"','"+email+"')", (err, result) => {
                    done();
                    if (err) {
                        res.end();
                        console.log(err.stack)
                    } else {
                        res.redirect("/");
                    }
                });
            }
        });
    }
});


app.get("/sinhvien/sua/:id",(req,res)=>{
    var id = req.params.id;
    pool.connect((err, client, done) => {
        if (err) { console.log(err) } else {
            client.query("select * from sinhvien where id='"+id+"'", (err, result) => {
                done();
                if (err) {
                    res.end();
                    console.log(err.stack)
                } else {
                    res.render("sinhvien_edit",{sinhvien : result.rows[0]});
                }
            });
        }
    });
});

app.post("/sinhvien/sua/:id",urlencodedParser,(req,res)=>{
    var id = req.params.id;
    pool.connect((err, client, done) => {
        if (err) { console.log(err) } else {
            let hoten = req.body.txtHoTen;
            let email = req.body.txtEmail;
            client.query("update sinhvien set hoten='"+hoten+"',email='"+email+"' where id='"+id+"'", (err, result) => {
                done();
                if (err) {
                    res.end();
                    console.log(err.stack)
                } else {
                    res.redirect("/");
                }
            });
        }
    });
});

app.get("/sinhvien/xoa/:id",(req,res)=>{
    var id = req.params.id;
    pool.connect((err, client, done) => {
        if (err) { console.log(err) } else {
            client.query("delete from sinhvien where id='"+id+"'", (err, result) => {
                done();
                if (err) {
                    res.end();
                    console.log(err.stack)
                } else {
                    res.redirect("/");
                }
            });
        }
    });
})