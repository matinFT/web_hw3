package main

// length 2 error for any problem with keys
// including having any extra key or one missing key
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
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	// "go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/mongo/readpref"
)

var jwtKey = []byte("majidT&matinF")
var emailRegex = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
var hexRegex = regexp.MustCompile("[0-9a-fA-F]+")
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
	router.GET("/api/post/", get_posts)
	router.POST("/api/admin/post/crud", create_post)
	router.PUT("/api/admin/post/crud/:id", update_post)
	router.DELETE("/api/admin/post/delet/:id", delete_post)
	router.GET("/api/admin/post/:id", read_post)

	router.Run(":8080")
}

func validate_token(c *gin.Context) (userEmail string, ok bool) {
	tknString, err := c.Cookie("token")
	if err != nil {
		return "not_set", false
	}
	claims := &Claims{}
	tkn, err := jwt.ParseWithClaims(tknString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !tkn.Valid {
		return "not_set", false
	}
	return claims.Email, true
}

// validates post to have just title and content keys
// generates the error itself
func validate_post(c *gin.Context) bool {
	c.Request.ParseMultipartForm(1000)
	form := c.Request.PostForm
	if !is_form_valid(form, []string{"title", "content"}) {
		c.JSON(400, gin.H{
			"message": "Request Length should be 2",
		})
		return false
	}
	title := form["title"][0]
	content := form["content"][0]
	if title == "" {
		c.JSON(400, gin.H{
			"message": "filed `title` is not valid",
		})
		return false
	} else if content == "" {
		c.JSON(400, gin.H{
			"message": "filed `content` is not valid",
		})
		return false
	}
	return true
}

// checks if form has keys matching the keys array.
// also checks if form length is equal to keys length.
func is_form_valid(form url.Values, keys []string) bool {
	if len(form) != len(keys) {
		return false
	}
	for _, val := range keys {
		_, ok1 := form[val]
		if !ok1 {
			return false
		}
	}
	return true
}

// valiadates email
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

// # length error
func validate_signin_up_request(c *gin.Context) bool {
	c.Request.ParseMultipartForm(1000)
	myform := c.Request.PostForm
	if !is_form_valid(myform, []string{"email", "password"}) {
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

func sign_up(c *gin.Context) {
	if !validate_signin_up_request(c) {
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

func sign_in(c *gin.Context) {
	if !validate_signin_up_request(c) {
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

func get_posts(c *gin.Context) {

}

// returns 401 if UNAUTHORIZED ( token has been expired or no token )
func create_post(c *gin.Context) {
	userEmail, ok := validate_token(c)
	if !ok {
		c.JSON(401, gin.H{
			"message": "you are UNAUTHORIZED.",
		})
		return
	} else if !validate_post(c) {
		return
	}
	myform := c.Request.PostForm
	title := myform["title"][0]
	content := myform["content"][0]
	collection := client.Database("Web_HW3").Collection("Post")
	insertResult, _ := collection.InsertOne(context.TODO(), Post{title, content, userEmail})
	c.JSON(200, gin.H{
		"id": insertResult.InsertedID,
	})

}

// # last line: c.String(204, "") ??
func update_post(c *gin.Context) {
	userEmail, ok := validate_token(c)
	if !ok {
		c.JSON(401, gin.H{
			"message": "you are UNAUTHORIZED.",
		})
		return
	} else if !validate_post(c) {
		return
	}
	myform := c.Request.PostForm
	title := myform["title"][0]
	content := myform["content"][0]
	postId := c.Param("id")
	if !hexRegex.MatchString(postId) {
		fmt.Println("here")
		c.JSON(400, gin.H{
			"message": "url id is not valid",
		})
		return
	}

	collection := client.Database("Web_HW3").Collection("Post")
	postObjectId, _ := primitive.ObjectIDFromHex(postId)
	filter := bson.M{"_id": postObjectId}
	var targetPost Post
	err = collection.FindOne(context.TODO(), filter).Decode(&targetPost)
	if err != nil {
		c.JSON(400, gin.H{
			"message": "url id is not valid",
		})
		return
	}
	if targetPost.UserEmail != userEmail {
		c.JSON(401, gin.H{
			"message": "permission denied.",
		})
		return
	}
	collection.UpdateOne(context.TODO(), filter,
		bson.D{
			{"$set", bson.D{{"title", title}, {"content", content}}},
		})
	c.String(204, "")
}

func delete_post(c *gin.Context) {

}

func read_post(c *gin.Context) {

}

type User struct {
	Email    string `json:”email,omitempty”`
	Password string `json:”password,omitempty”`
}

type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

type Post struct {
	Title     string `json:”title,omitempty”`
	Content   string `json:”content,omitempty”`
	UserEmail string `json:”userEmail,omitempty”`
}
