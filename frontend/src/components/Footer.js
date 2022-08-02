import React, { Component } from "react";

export default class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ backgroundColor: 'var(--light-grey)'}} className="container-fluid text-white d-flex justify-content-center">
        <div className="container row p-5">
          <div className="col me-5">
            <div className="mb-2">
              <span className="h5">Для клиента</span>
            </div>
            <span>Магазины</span><br/>
            <span>Доставка</span><br/>
            <span>Условия пользования</span><br/>
            <span>Политика конфиденциальности</span><br/>
            <span>Сертификаты</span><br/>
            <span>Материалы</span><br/>
            <span>Акции</span><br/>
          </div>
          <div className="col ms-5">
            <div className="mb-2">
              <span className="h5">Компания</span>
            </div>
            <span>О нас</span>
          </div>
          <div className="col me-5">
            <span>Магазины, а также офис работают круглосуточно с 9 часов утра, до 6 часов вечера, за исключением оффициальных праздничных дней</span>
          </div>
          <div className="col ms-5">
            <div className="mb-2">
              <span className="h5">Позвоните Нам</span><br/>
            </div>
            <span>079 40-70-32</span>
            <div className="mb-2 mt-4">
              <span className="h5">Напишите Нам</span><br/>
            </div>
            <span>test@gmail.com</span>
            <div className="mb-2 mt-4">
              <span className="h5">Подпишитесь на Нас</span><br/>
            </div>
            <div className="row">
              <a target="_blank" href="https://www.facebook.com/MatrasyVegasMoldova/" style={{ color: '#efefef' }} className="no-hover">
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
