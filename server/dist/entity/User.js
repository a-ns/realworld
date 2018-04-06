"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Article_1 = require("./Article");
const Comment_1 = require("./Comment");
let User = User_1 = class User extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "token", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    typeorm_1.OneToMany(() => Article_1.Article, article => article.author),
    __metadata("design:type", Array)
], User.prototype, "articles", void 0);
__decorate([
    typeorm_1.OneToMany(() => Comment_1.Comment, comment => comment.author),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Article_1.Article, article => article.favoritedBy),
    __metadata("design:type", Array)
], User.prototype, "favorites", void 0);
__decorate([
    typeorm_1.OneToMany(() => User_1, user => user.followers),
    __metadata("design:type", Array)
], User.prototype, "following", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1, user => user.following),
    __metadata("design:type", Array)
], User.prototype, "followers", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
var User_1;
//# sourceMappingURL=User.js.map