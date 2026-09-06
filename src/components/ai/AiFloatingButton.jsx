"use client";

import React, { useEffect, useState } from "react";

import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiPlus,
  FiChevronUp,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";

import { getProductsForAI } from "../../services/aiProductService";

import "./AiFloatingButton.css";


/* =========================================================
   SUGGESTED QUESTIONS
========================================================= */

const suggestedQuestions = [
  "🥭 Which mango is the cheapest?",
  "💰 Which mangoes are under ₹600?",
  "⭐ Which mango has the highest rating?",
  "🛒 Which products are available?",
];

/* =========================================================
   MANUAL QUESTIONS & ANSWERS
   Add your own questions and answers here.
========================================================= */

const manualQuestions = [
  {
    keywords: [
      "what is maviina mane",
      "about maviina mane",
      "tell me about maviina mane",
    ],
    answer:
      "Maviina Mane brings farm-fresh mangoes and selected farm products to your home. 🥭",
  },

  {
    keywords: [
      "where are your mangoes from",
      "where do mangoes come from",
      "mango origin",
    ],
    answer:
      "Our mangoes are sourced from trusted orchards and carefully selected for freshness and quality. 🥭",
  },

  {
    keywords: [
      "do you deliver",
      "delivery available",
      "do you provide delivery",
    ],
    answer:
      "Yes! Delivery is available for eligible locations. You can check delivery availability by entering your pincode during checkout. 🚚",
  },

  {
    keywords: [
      "how long does delivery take",
      "delivery time",
      "when will my order arrive",
    ],
    answer:
      "Delivery time depends on your location and the delivery option selected during checkout. 🚚",
  },

  {
    keywords: [
      "are mangoes naturally ripened",
      "natural ripening",
      "are your mangoes natural",
    ],
    answer:
      "Our mangoes are naturally ripened and carefully selected for their natural taste, aroma, and quality. 🌱🥭",
  },

  {
    keywords: [
      "how do i order",
      "how to order",
      "place an order",
    ],
    answer:
      "Choose a product, add it to your cart, continue to checkout, enter your delivery details, select your delivery option, and complete the payment. 🛒",
  },

  {
    keywords: [
      "payment methods",
      "how can i pay",
      "what payment methods do you accept",
    ],
    answer:
      "You can use the payment options available on the checkout page to complete your order. 💳",
  },

  {
    keywords: [
      "how can i contact you",
      "contact you",
      "customer support",
      "support",
    ],
    answer:
      "You can contact the Maviina Mane support team through the Contact Us section of the website. 😊",
  },

  {
    keywords: [
      "can i cancel my order",
      "cancel order",
      "order cancellation",
    ],
    answer:
      "Order cancellation depends on the current order status. Please contact customer support as soon as possible if you need to cancel an order.",
  },
];


/* =========================================================
   FIND MANUAL ANSWER
========================================================= */

const findManualAnswer = (question) => {
  const text = question.toLowerCase().trim();

  for (const item of manualQuestions) {
    const matched = item.keywords.some((keyword) =>
      text.includes(keyword)
    );

    if (matched) {
      return item.answer;
    }
  }

  return null;
};


/* =========================================================
   FIND PRODUCTS
========================================================= */

const findProducts = (products, question) => {
  const text = question.toLowerCase();

  /* -------------------------------------------------------
     CHEAPEST
  ------------------------------------------------------- */

  if (
    text.includes("cheapest") ||
    text.includes("lowest price")
  ) {
    const mangoes = products.filter(
      (product) =>
        product.active &&
        product.variety?.toLowerCase() !== "tomato"
    );

    if (!mangoes.length) {
      return {
        text: "I couldn't find any mango products right now.",
        products: [],
      };
    }

    const cheapest = [...mangoes].sort(
      (a, b) => a.price - b.price
    )[0];

    return {
      text: `The most affordable mango is ${cheapest.name} at ₹${cheapest.price} for ${cheapest.weight}. 🥭`,
      products: [cheapest],
    };
  }


  /* -------------------------------------------------------
     UNDER ₹600
  ------------------------------------------------------- */

  if (
    text.includes("under ₹600") ||
    text.includes("under 600") ||
    text.includes("below ₹600") ||
    text.includes("below 600")
  ) {
    const matchingProducts = products.filter(
      (product) =>
        product.active &&
        product.price <= 600
    );

    return {
      text:
        matchingProducts.length > 0
          ? `I found ${matchingProducts.length} product(s) under ₹600.`
          : "I couldn't find any products under ₹600.",
      products: matchingProducts,
    };
  }


  /* -------------------------------------------------------
     HIGHEST RATING
  ------------------------------------------------------- */

  if (
    text.includes("highest rating") ||
    text.includes("best rated") ||
    text.includes("highest rated")
  ) {
    const mangoes = products.filter(
      (product) =>
        product.active &&
        product.variety?.toLowerCase() !== "tomato"
    );

    if (!mangoes.length) {
      return {
        text: "I couldn't find any rated mangoes.",
        products: [],
      };
    }

    const highestRating = Math.max(
      ...mangoes.map((product) => Number(product.rating) || 0)
    );

    const highestRated = mangoes.filter(
      (product) =>
        Number(product.rating) === highestRating
    );

    return {
      text:
        highestRated.length === 1
          ? `${highestRated[0].name} has the highest rating at ${highestRated[0].rating} ⭐ from ${highestRated[0].reviews} reviews.`
          : `These mangoes have the highest rating of ${highestRating} ⭐: ${highestRated
              .map((product) => product.name)
              .join(", ")}.`,
      products: highestRated,
    };
  }


  /* -------------------------------------------------------
     AVAILABLE PRODUCTS
  ------------------------------------------------------- */

  if (
    text.includes("available") ||
    text.includes("available products")
  ) {
    const availableProducts = products.filter(
      (product) =>
        product.active &&
        product.available
    );

    return {
      text:
        availableProducts.length > 0
          ? `I found ${availableProducts.length} available products for you. 🛒`
          : "There are no available products right now.",
      products: availableProducts,
    };
  }


  /* -------------------------------------------------------
     ALPHONSO
  ------------------------------------------------------- */

  if (text.includes("alphonso")) {
    const product = products.find(
      (item) =>
        item.variety?.toLowerCase() === "alphonso"
    );

    if (product) {
      return {
        text: `${product.name} is ₹${product.price} for ${product.weight}. It has a ${product.rating} ⭐ rating.`,
        products: [product],
      };
    }
  }


  /* -------------------------------------------------------
     KESAR
  ------------------------------------------------------- */

  if (text.includes("kesar")) {
    const product = products.find(
      (item) =>
        item.variety?.toLowerCase() === "kesar"
    );

    if (product) {
      return {
        text: `${product.name} is ₹${product.price} for ${product.weight}. It has a ${product.rating} ⭐ rating.`,
        products: [product],
      };
    }
  }


  /* -------------------------------------------------------
     BANGANAPALLI
  ------------------------------------------------------- */

  if (text.includes("banganapalli")) {
    const product = products.find(
      (item) =>
        item.variety?.toLowerCase() === "banganapalli"
    );

    if (product) {
      return {
        text: `${product.name} is ₹${product.price} for ${product.weight}. It has a ${product.rating} ⭐ rating.`,
        products: [product],
      };
    }
  }


  /* -------------------------------------------------------
     DASHERI
  ------------------------------------------------------- */

  if (text.includes("dasheri")) {
    const product = products.find(
      (item) =>
        item.variety?.toLowerCase() === "dasheri"
    );

    if (product) {
      return {
        text: `${product.name} is ₹${product.price} for ${product.weight}. It has a ${product.rating} ⭐ rating.`,
        products: [product],
      };
    }
  }


  /* -------------------------------------------------------
     DEFAULT
  ------------------------------------------------------- */

  return {
    text:
      "I can help you find mangoes by price, rating, variety and availability. 🥭",
    products: [],
  };
};


/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductRecommendation = ({ product }) => {
  return (
    <div className="ai-product-card">

      <div className="ai-product-image-wrapper">
        {product.imageUrl ? (
          <img
            src={`http://localhost:8080${product.imageUrl}`}
            alt={product.name}
            className="ai-product-image"
          />
        ) : (
          <div className="ai-product-placeholder">
            🥭
          </div>
        )}
      </div>

      <div className="ai-product-details">

        <h5>
          {product.name}
        </h5>

        <span className="ai-product-weight">
          {product.weight}
        </span>

        <div className="ai-product-rating">
          <FiStar />

          <span>
            {product.rating || 0}
          </span>

          <small>
            ({product.reviews || 0})
          </small>
        </div>

        <div className="ai-product-bottom">

          <strong>
            ₹{product.price}
          </strong>

          {/* <button
            type="button"
            className="ai-add-cart-button"
            onClick={() => {
              console.log(
                "Add to cart:",
                product
              );
            }}
          >
            <FiShoppingCart />

            Add
          </button> */}
          {product.stockQuantity > 0 ? (
  <button
    type="button"
    className="ai-add-cart-button"
    onClick={() => {
      console.log(
        "Add to cart:",
        product
      );
    }}
  >
    <FiShoppingCart />

    Add
  </button>
) : (
  <span className="ai-out-of-stock">
    Out of Stock
  </span>
)}

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   AI COMPONENT
========================================================= */

const AiFloatingButton = () => {

  const [open, setOpen] = useState(false);

  const [products, setProducts] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text:
        "👋 Hi! I'm Maviina AI. How can I help you find the perfect mango today?",
      products: [],
    },
  ]);

  const [input, setInput] = useState("");

  const [typing, setTyping] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);


  /* =======================================================
     LOAD PRODUCTS
  ======================================================= */

  useEffect(() => {

    if (!open) {
      return;
    }

    const loadProducts = async () => {

      const data = await getProductsForAI();

      setProducts(data);

    };

    loadProducts();

  }, [open]);


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const sendMessage = (messageText) => {

    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || typing) {
      return;
    }


    /* USER MESSAGE */

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
      products: [],
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");

    setTyping(true);


    /* AI RESPONSE */

    setTimeout(() => {

      /* =====================================================
         CHECK MANUAL QUESTIONS FIRST
      ===================================================== */

      const manualAnswer = findManualAnswer(
        trimmedMessage
      );

      if (manualAnswer) {

        const aiMessage = {
          id: Date.now() + 1,
          sender: "ai",
          text: manualAnswer,
          products: [],
        };

        setMessages((prev) => [
          ...prev,
          aiMessage,
        ]);

        setTyping(false);

        return;
      }


      /* =====================================================
         CHECK PRODUCT QUESTIONS
      ===================================================== */

      const result = findProducts(
        products,
        trimmedMessage
      );

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: result.text,
        products: result.products || [],
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      setTyping(false);

    }, 900);
  };


  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = (event) => {

    event.preventDefault();

    sendMessage(input);

  };


  /* =======================================================
     SUGGESTED QUESTION
  ======================================================= */

  const handleSuggestedQuestion = (question) => {

    setShowSuggestions(false);

    sendMessage(question);

  };


  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      {/* =====================================================
          FLOATING BUTTON
      ===================================================== */}

      <div className="ai-floating-wrapper">

        {!open && (
          <div className="ai-floating-tooltip">

            <span>
              Need help?
            </span>

            <strong>
              Ask Maviina AI
            </strong>

          </div>
        )}


        <button
          type="button"
          className="ai-floating-button"
          onClick={() =>
            setOpen((prev) => !prev)
          }
          aria-label={
            open
              ? "Close Maviina AI"
              : "Open Maviina AI"
          }
          aria-expanded={open}
        >

          {open ? (
            <FiX
              className="ai-floating-close-icon"
            />
          ) : (
            <>
              <span className="ai-mango-icon">
                🥭
              </span>

              <FiMessageCircle
                className="ai-message-icon"
              />
            </>
          )}

          {!open && (
            <span className="ai-online-dot" />
          )}

        </button>

      </div>


      {/* =====================================================
          CHAT WINDOW
      ===================================================== */}

      {open && (
        <div className="ai-chat-window">

          {/* HEADER */}

          <div className="ai-chat-header">

            <div className="ai-avatar">
              🥭
            </div>

            <div className="ai-header-content">

              <h4>
                Maviina AI
              </h4>

              <span>
                Your Mango Expert
              </span>

            </div>

            <div className="ai-header-status">

              <span className="ai-status-dot" />

              Online

            </div>

            <button
              type="button"
              className="ai-close-button"
              onClick={() =>
                setOpen(false)
              }
              aria-label="Close Maviina AI"
            >
              <FiX />
            </button>

          </div>


          {/* CHAT BODY */}

          <div className="ai-chat-body">

            <div className="ai-welcome-label">
              MAVIINA AI ASSISTANT
            </div>


            {messages.map((message) => (

              <React.Fragment key={message.id}>

                {/* MESSAGE */}

                <div
                  className={`ai-message-row ${
                    message.sender === "user"
                      ? "user-message-row"
                      : ""
                  }`}
                >

                  {message.sender === "ai" && (
                    <div className="ai-small-avatar">
                      🥭
                    </div>
                  )}

                  <div
                    className={`ai-message ${
                      message.sender === "user"
                        ? "user-message"
                        : "assistant-message"
                    }`}
                  >
                    {message.text}
                  </div>

                </div>


                {/* PRODUCTS FOR THIS AI RESPONSE ONLY */}

                {message.sender === "ai" &&
                  message.products?.length > 0 && (

                    <div className="ai-product-list">

                      {message.products
                        .slice(0, 4)
                        .map((product) => (
                          <ProductRecommendation
                            key={product.id}
                            product={product}
                          />
                        ))}

                    </div>

                  )}

              </React.Fragment>

            ))}


            {/* TYPING */}

            {typing && (

              <div className="ai-message-row">

                <div className="ai-small-avatar">
                  🥭
                </div>

                <div className="ai-typing">

                  <span />
                  <span />
                  <span />

                </div>

              </div>

            )}


            {/* SUGGESTIONS */}

            {showSuggestions && !typing && (

              <div className="ai-suggestions">

                <div className="ai-suggestions-header">

                  <p>
                    Add a suggestion
                  </p>

                  <button
                    type="button"
                    className="ai-suggestions-close"
                    onClick={() =>
                      setShowSuggestions(false)
                    }
                    aria-label="Close suggestions"
                  >
                    <FiX />
                  </button>

                </div>

                <div className="ai-suggestion-list">

                  {suggestedQuestions.map(
                    (question) => (

                      <button
                        key={question}
                        type="button"
                        className="ai-suggestion-button"
                        onClick={() =>
                          handleSuggestedQuestion(
                            question
                          )
                        }
                      >

                        <span className="ai-suggestion-text">
                          {question}
                        </span>

                        <span className="suggestion-arrow">
                          →
                        </span>

                      </button>

                    )
                  )}

                </div>

              </div>

            )}


          </div>


          {/* INPUT */}

          <form
            className="ai-chat-input-area"
            onSubmit={handleSubmit}
          >

            <button
              type="button"
              className={`ai-suggestion-toggle ${
                showSuggestions
                  ? "suggestion-toggle-active"
                  : ""
              }`}
              onClick={() =>
                setShowSuggestions((prev) => !prev)
              }
              aria-label={
                showSuggestions
                  ? "Hide suggestions"
                  : "Add suggestion"
              }
              aria-expanded={showSuggestions}
            >
              {showSuggestions ? (
                <FiChevronUp />
              ) : (
                <FiPlus />
              )}
            </button>


            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask anything about mangoes..."
              disabled={typing}
            />


            <button
              type="submit"
              className="ai-send-button"
              disabled={
                !input.trim() ||
                typing
              }
              aria-label="Send message"
            >
              <FiSend />
            </button>

          </form>


          <div className="ai-powered-text">
            Maviina AI • Your smart mango assistant
          </div>

        </div>
      )}
    </>
  );
};

export default AiFloatingButton;