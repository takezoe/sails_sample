package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json.Json._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def user(id: Int) = Action {
    Ok(toJson(Map(
      "userId"   -> toJson(id),
      "userName" -> toJson("takezoe")
    )))
  }

  def message(id: Int) = Action {
    Ok(toJson(Map(
      "messageId" -> toJson(id),
      "userId"    -> toJson(123),
      "message"   -> toJson("Hello World,")
    )))
  }

}