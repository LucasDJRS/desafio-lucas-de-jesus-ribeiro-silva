class CaixaDaLanchonete {
  getMenuItem(key) {
    const menu = {
      cafe: {
        descricao: "Café",
        valor: 3.0,
      },
      chantily: {
        descricao: "Chantily (extra do Café)",
        valor: 1.5,
        principal: "cafe",
      },
      suco: {
        descricao: "Suco Natural",
        valor: 6.2,
      },
      sanduiche: {
        descricao: "Sanduíche",
        valor: 6.5,
      },
      queijo: {
        descricao: "Queijo (extra do Sanduíche)",
        valor: 2.0,
        principal: "sanduiche",
      },
      salgado: {
        descricao: "Salgado",
        valor: 7.25,
      },
      combo1: {
        descricao: "1 Suco e 1 Sanduíche",
        valor: 9.5,
      },
      combo2: {
        descricao: "1 Café e 1 Sanduíche",
        valor: 7.5,
      },
    };
    return menu[key];
  }

  getPaymentMethodTax(key) {
    const paymentMethods = {
      debito: 1,
      dinheiro: 0.95,
      credito: 1.03,
    };
    return paymentMethods[key];
  }

  getValueByPaymentMethod(paymentMethod, value) {
    return this.getPaymentMethodTax(paymentMethod) * value;
  }

  orderIsValid(order, paymentMethod) {
    let isInvalidItem = false;
    let productWithoutAmount = false;

    if (order.length === 0) {
      return "Não há itens no carrinho de compra!";
    }

    if (!this.getPaymentMethodTax(paymentMethod)) {
      return "Forma de pagamento inválida!";
    }
    order.forEach((item) => {
      if (!this.getMenuItem(item.key)) {
        isInvalidItem = true;
        return;
      }
    });
    if (isInvalidItem) {
      return "Item inválido!";
    }

    order.forEach((item) => {
      if (!item.amount) {
        productWithoutAmount = true;
        return;
      }
    });
    if (productWithoutAmount) {
      return "Quantidade inválida!";
    }

    let mains = [];
    let accompaniments = [];
    order.forEach((item) => {
      if (typeof item?.principal === "string") {
        accompaniments.push(item.principal);
      } else {
        mains.push(item.key);
      }
    });

    let msg = "";
    accompaniments.forEach((item) => {
      if (!mains.includes(item)) {
        msg = "Item extra não pode ser pedido sem o principal";
      }
    });
    if (msg) {
      return msg;
    }
    return "";
  }

  calcularValorDaCompra(metodoDePagamento, items) {
    const mappedItems = items.map((item) => {
      const [key, amount] = item.split(",");
      return { ...this.getMenuItem(key), amount: +amount, key };
    });

    const errorMessage = this.orderIsValid(mappedItems, metodoDePagamento);
    if (errorMessage.length > 0) {
      return errorMessage;
    }

    let totalValue = mappedItems.reduce((acc, item) => {
      const { valor, amount } = item;
      return acc + valor * amount;
    }, 0);

    totalValue = +this.getValueByPaymentMethod(
      metodoDePagamento,
      totalValue
    ).toFixed(2);

    return totalValue.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }
}

export { CaixaDaLanchonete };
