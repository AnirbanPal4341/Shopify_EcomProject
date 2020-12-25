import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { Cart } from "./cart.model"
import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private cartItems:Cart[]=[];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  private cartUpdated = new Subject<{ cartItems: Cart[];cartCount:number}>();
  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                type:post.type,
                description:post.description,
                imagePath: post.imagePath,
                brand: post.brand,
                material:post.material,
                size:post.size,
                price: post.price,
                availability:post.availability,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }
  getUserCart(userId:string){
    this.http
      .get<{  message: string; posts: any}>(
        "http://localhost:3000/api/cart/getCartItems"
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                type:post.type,
                imagePath: post.imagePath,
                price: post.price,
                creator: post.creator
              };
            })
          };
        })
      )
      .subscribe(transformedPostData => {
        this.cartItems = transformedPostData.posts;
        this.cartItems=this.cartItems.filter(f=>f.creator == userId);
        this.cartUpdated.next({
          cartItems: [...this.cartItems],
          cartCount: this.cartItems.length
        });
      });
  }


  getUserDetails(userId:string){
    return this.http.get<{
      _id:string,
      username: string;
      email: string;
      address: string;
      phone_number: string;
      age: string;
      gender: string;
      password:string;
  }>("http://localhost:3000/api/user/" + userId);
  }


  getUserListings(userId:string) {
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts"
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                type:post.type,
                description:post.description,
                imagePath: post.imagePath,
                brand: post.brand,
                material:post.material,
                size:post.size,
                price: post.price,
                availability:post.availability,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.posts=this.posts.filter(f=> f.creator == userId);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.posts.length
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getCartUpdateListener() {
    return this.cartUpdated.asObservable();
  }


  getPost(id: string) {
    return this.http.get<{
        _id: string;
        type: string;
        description: string;
        imagePath: string;
        brand: string;
        material: string;
        size: string;
        price: string;
        availability: string;
        creator: string;
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(type: string, description: string, image: File , brand:string ,material:string,size:string,price:string,availability:string ) {
    const postData = new FormData();
    postData.append("type", type);
    postData.append("description", description);
    postData.append("image", image, type);
    postData.append("brand", brand);
    postData.append("material", material);
    postData.append("size", size);
    postData.append("price", price);
    postData.append("availability", availability); 
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  addToCart(type:string,imagePath:string,price:string,creator:string)
  {
    const userCart: Cart = { id:null,type: type, imagePath:imagePath  , price:price , creator:creator};
    this.http
      .post("http://localhost:3000/api/cart/addToCart", userCart)
      .subscribe(response => {
        console.log(response);
        window.alert("Item added to Cart!");
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, type: string, description: string, image: File | string, brand:string ,material:string,size:string,price:string,availability:string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("type", type);
      postData.append("description", description);
      postData.append("image", image, type);
      postData.append("brand", brand);
      postData.append("material", material);
      postData.append("size", size);
      postData.append("price", price);
      postData.append("availability", availability);
    } else {
      postData = {
        id: id,
        type:type,
        description:description,
        imagePath: image,
        brand: brand,
        material:material,
        size:size,
        price: price,
        availability:availability,
        creator: null
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }
  deleteCart(postId: string){
    return this.http.delete("http://localhost:3000/api/cart/" + postId);
  }
}
