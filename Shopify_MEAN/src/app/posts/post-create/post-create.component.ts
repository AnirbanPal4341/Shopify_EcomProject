import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private postId: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      type: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      material: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      price: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      size: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      availability: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      brand: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
        
            id: postData._id,
            type:postData.type,
            description:postData.description,
            imagePath: postData.imagePath,
            brand: postData.brand,
            material:postData.material,
            size:postData.size,
            price: postData.price,
            availability:postData.availability,
            creator: postData.creator
          };
          this.form.setValue({
            type: this.post.type,
            description: this.post.description,
            image: this.post.imagePath,
            brand:this.post.brand,
            material:this.post.material,
            size:this.post.size,
            availability:this.post.availability,
            price:this.post.price,
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.type,
        this.form.value.description,
        this.form.value.image,
        this.form.value.brand,
        this.form.value.material,
        this.form.value.size,
        this.form.value.price,
        this.form.value.availability
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.type,
        this.form.value.description,
        this.form.value.image,
        this.form.value.brand,
        this.form.value.material,
        this.form.value.size,
        this.form.value.price,
        this.form.value.availability
      );
    }
    this.form.reset();
  }
}
