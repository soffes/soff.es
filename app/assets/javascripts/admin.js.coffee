#= require jquery
#= require self

$ ->
  generatePermalink = (text) ->
    text.toLowerCase().replace(/\s+/g, "-").replace(/'":\.\/&^\*/g, "")
  
  permalink = $("input#post_permalink")
  
  $("input#post_title").blur ->
    if permalink.val() == ""
      permalink.val(generatePermalink($(this).val()))