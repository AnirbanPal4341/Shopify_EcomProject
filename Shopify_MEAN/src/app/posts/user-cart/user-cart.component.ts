import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { Cart } from "../cart.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-cart-list",
  templateUrl: "./user-cart.component.html",
  styleUrls: ["./user-cart.component.css"]
})
export class CartComponent implements OnInit, OnDestroy {
  posts: Cart[] = [];
  isLoading = false;
  totalPosts = 0;
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}
//*ngIf="userIsAuthenticated && userId === post.creator" 
  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService.getUserCart(this.userId); 
    this.postsSub = this.postsService
      .getCartUpdateListener()
      .subscribe((postData: { cartItems: Cart[]; cartCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.cartCount;
        this.posts = postData.cartItems;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  

  onRemoveCart(postId: string) {
    this.isLoading = true;
    this.postsService.deleteCart(postId).subscribe(() => {
      this.postsService.getUserCart(this.userId);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
