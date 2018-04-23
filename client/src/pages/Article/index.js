import React from "react";

const Article = props => {
  console.log(props);
  return <div>Article slug: {props.match.params.slug}</div>;
};

export default Article;
