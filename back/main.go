package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	// "go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/mongo/readpref"
)

var emailRegex = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
var clientOptions = options.Client().ApplyURI("mongodb://localhost:27017")
var client, err = mongo.Connect(context.TODO(), clientOptions)

func main() {
	fmt.Println("hello")
	// connect to db
	// Set client options

	if err != nil {
		log.Fatal(err)
	}
	// var client, err = mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// var ctx, _ = context.WithTimeout(context.Background(), 10*time.Second)
	// err = client.Connect(ctx)
	// defer client.Disconnect(ctx)

	router := gin.Default()
	router.POST("/api/signup", sign_up)
	router.Run(":8080")
}

func sign_up(c *gin.Context) {
	email := c.PostForm("email")
	password := c.PostForm("password")
	// fmt.Println(c.Request.Body)
	if !isEmailValid(email) {
		c.JSON(400, gin.H{
			"message": "filed `email` is not valid",
		})
		return
	}
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

type User struct {
	Email    string `json:”email,omitempty”`
	Password string `json:”password,omitempty”`
}
