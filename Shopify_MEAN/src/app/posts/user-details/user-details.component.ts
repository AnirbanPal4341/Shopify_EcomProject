import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { PostsService } from "../posts.service";
import { UserData } from "../../auth/user-data.model";


@Component({
  selector: "app-post-mydetails",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"]
})
export class UserDetailsComponent implements OnInit {
  post: UserData;
  isLoading = false;
  form: FormGroup;
  private userId: string;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      address: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      phone_number: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      age: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      gender: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
    });
        this.isLoading = true;
        this.userId = this.authService.getUserId();
        this.postsService.getUserDetails(this.userId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            username:postData.username,
            email:postData.email,
            address: postData.address,
            phone_number: postData.phone_number,
            age:postData.age,
            gender:postData.gender,
            password:null
          };
          this.form.setValue({
            username: this.post.username,
            email: this.post.email,
            address: this.post.address,
            phone_number:this.post.phone_number,
            age:this.post.age,
            gender:this.post.gender
        });
    });
  }    
}
