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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Tag_1 = require("./Tag");
const lodash_1 = require("lodash");
const User_1 = require("./User");
const Comment_1 = require("./Comment");
let Article = Article_1 = class Article extends typeorm_1.BaseEntity {
    static saveWithTags(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const tagsKinds = args.tags.map((tag) => tag.kind);
            let tagsKindsFinds = tagsKinds.map((kind) => Tag_1.Tag.find({ where: { kind } }));
            tagsKindsFinds = lodash_1.flattenDeep(yield Promise.all(tagsKindsFinds));
            let tagsToMake = args.tags;
            tagsToMake = lodash_1.difference(tagsKinds, tagsKindsFinds.map((f) => f.kind));
            const tagsMade = yield Promise.all(tagsToMake.map(kind => Tag_1.Tag.create({ kind }).save()));
            const finalTags = [...tagsKindsFinds, ...tagsMade];
            const article = Article_1.create(Object.assign({}, args));
            article.tags = finalTags;
            return article.save();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Article.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Article.prototype, "slug", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Article.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Article.prototype, "body", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Tag_1.Tag, { cascade: true }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Article.prototype, "tags", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Article.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Article.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, user => user.articles),
    __metadata("design:type", User_1.User)
], Article.prototype, "author", void 0);
__decorate([
    typeorm_1.OneToMany(() => Comment_1.Comment, comment => comment.article),
    __metadata("design:type", Array)
], Article.prototype, "comments", void 0);
__decorate([
    typeorm_1.ManyToMany(() => User_1.User, user => user.favorites),
    __metadata("design:type", Array)
], Article.prototype, "favoritedBy", void 0);
Article = Article_1 = __decorate([
    typeorm_1.Entity()
], Article);
exports.Article = Article;
var Article_1;
//# sourceMappingURL=Article.js.map