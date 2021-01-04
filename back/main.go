package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	// "go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/mongo/readpref"
)

var jwtKey = []byte("majidT&matinF")
var emailRegex = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
var clientOptions = options.Client().ApplyURI("mongodb://localhost:27017")
var client, err = mongo.Connect(context.TODO(), clientOptions)

func main() {
	fmt.Println("hello")

	if err != nil {
		log.Fatal(err)
	}

	router := gin.Default()
	router.POST("/api/signup", sign_up)
	router.POST("/api/signin", sign_in)

	router.Run(":8080")
}

func is_form_valid(form url.Values) bool {
	_, ok1 := form["email"]
	_, ok2 := form["password"]
	if !ok1 || !ok2 || len(form) != 2 {
		return false
	}
	return true
}

func isEmailValid(e string) bool {
	if len(e) < 3 && len(e) > 254 {
		return false
	}
	if !emailRegex.MatchString(e) {
		return false
	}
	parts := strings.Split(e, "@")
	mx, err := net.LookupMX(parts[1])
	if err != nil || len(mx) == 0 {
		return false
	}
	return true
}

func validate_request(c *gin.Context) bool {
	c.Request.ParseMultipartForm(1000)
	myform := c.Request.PostForm
	if !is_form_valid(myform) {
		c.JSON(400, gin.H{
			"message": "Request Length should be 2",
		})
		return false
	}
	email := myform["email"][0]
	password := myform["password"][0]
	if !isEmailValid(email) {
		c.JSON(400, gin.H{
			"message": "filed `email` is not valid",
		})
		return false
	} else if len(password) <= 5 {
		c.JSON(400, gin.H{
			"message": "field 'password'.length should be gt 5.",
		})
		return false
	}
	return true
}

func make_token(email string) (string, bool) {
	expirationTime := time.Now().Add(60 * time.Minute)
	// build token
	claims := &Claims{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", true
	}
	return tokenString, false
}

func sign_in(c *gin.Context) {
	if !validate_request(c) {
		return
	}
	myform := c.Request.PostForm
	email := myform["email"][0]
	password := myform["password"][0]

	collection := client.Database("Web_HW3").Collection("User")
	filter := bson.M{"email": email}
	var result User
	err = collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil || result.Password != password {
		c.JSON(400, gin.H{
			"message": "wrong email or password.",
		})
		return
	}

	tokenString, err := make_token(email)
	if err {
		fmt.Println("token string error")
		return
	}

	c.SetCookie("token", tokenString, 3600, "/", "localhost", false, true)
	c.JSON(200, gin.H{
		"message": tokenString,
	})
}

func sign_up(c *gin.Context) {
	if !validate_request(c) {
		return
	}
	myform := c.Request.PostForm
	email := myform["email"][0]
	password := myform["password"][0]

	collection := client.Database("Web_HW3").Collection("User")
	filter := bson.M{"email": email}
	var result User
	err = collection.FindOne(context.TODO(), filter).Decode(&result)
	if err == nil {
		c.JSON(409, gin.H{
			"message": "email already exist.",
		})
		return
	} else {
		collection.InsertOne(context.TODO(), User{email, password})
		c.JSON(201, gin.H{
			"massage": "user has been created",
		})
	}
}

type User struct {
	Email    string `json:”email,omitempty”`
	Password string `json:”password,omitempty”`
}

type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}
