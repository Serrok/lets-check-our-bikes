import React from 'react'
import DuckImage from '../assets/Duck.jpg'
import './HomeView.scss'

export default class Home extends React.Component {
  state = {
    currentQues: 0,
    endQues: 99,
    currentState: "question",
    conditions: []
  }

  selectAnsewer(goto, selectionConditions) {
    document.getElementById("scenery").classList.add("hide");
    setTimeout(() => {
      if (goto !== this.state.endQues) {
        this.setState({
          currentQues: goto,
          conditions: this.state.conditions.concat(selectionConditions)
        })
        setTimeout(() => {
          document.getElementById("scenery").classList.remove("hide");
        }, 100);
      } else {
        this.setState({
          currentState: "processing",
          conditions: this.state.conditions.concat(selectionConditions)
        });
        setTimeout(() => {
          document.getElementById("scenery").classList.remove("hide");
          setTimeout(() => {
            document.getElementById("scenery").classList.add("hide");
            setTimeout(() => {
              this.setState({ currentState: "result" })
              setTimeout(() => {
                document.getElementById("scenery").classList.remove("hide");
              }, 100);
            }, 300);
          }, 2000);
        }, 300);
      }
    }, 300);
  }

  isConditionMatch(resultConditions) {
    for (let condition of resultConditions) {
      if (this.state.conditions.indexOf(condition) !== -1) {
        return true
      }
    }
    return false
  }

  render() {
    switch (this.state.currentState) {
      case "question":
        let thisQues = this.props.questions[this.state.currentQues];
        return (
          <div id="scenery" className="scenery question">
              <h2>{ thisQues.title }</h2>
              <p className="description">{ thisQues.description }</p>
              {thisQues.answers.map((answer, index) => {
                return <div className="button" key={ index } onClick={ () => this.selectAnsewer(answer.goto, answer.conditions) }>{ answer.string }</div>
              })}
          </div>
        )

      case "processing":
        return (
          <div id="scenery" className="scenery processing hide">
            <h2>請稍候</h2>
            <p className="description">{ this.props.processing[Math.floor(Math.random() * this.props.processing.length)] }</p>
          </div>
        )

      case "result":
        return (
          <div id="scenery" className="scenery result">
            <h2>結果</h2>
            <h3>您將可能遭遇以下情況</h3>
            <ul className="result-list">
              {this.props.results.occurs.map((result, index) => {
                if (this.isConditionMatch(result.conditions)) {
                  return <li key={ index }>{ result.string }</li>
                }
              })}
            </ul>
            <h3>您可能已違反以下法規</h3>
              <ul className="result-list">
              {this.props.results.rules.map((result, index) => {
                if (this.isConditionMatch(result.conditions)) {
                  return <li key={ index }>{ result.string }</li>
                }
              })}
              </ul>
            <h3>您將可能會</h3>
              <ul className="result-list">
                {(() => {
                  let subjectList = []
                  this.props.results.subject.map((result, index) => {
                    if (this.isConditionMatch(result.conditions)) {
                      subjectList.push(<li key={ index }>{ result.string }</li>);
                    }
                  })
                  return subjectList.length > 0 ? subjectList : <li id="subject_place_holder">沒事兒～孩子別怕。</li>
                })()}
              </ul>
            <h3>您必須配合</h3>
              <ul className="result-list">
              {this.props.results.shalldo.map((result, index) => {
                if (this.isConditionMatch(result.conditions)) {
                  return <li key={ index }>{ result.string }</li>
                }
              })}
              </ul>
            <h3>但是，您也可以...</h3>
            {(() => {
              if (this.state.conditions[0] !== "GODIE") {
                return (
                  <ul className="result-list">
                    <li>不要畏懼來自主管機關的任何壓力。</li>
                    <li>依照情況，向主管機關針對不合理的舉證及裁罰，據以力爭地提出申訴。</li>
                    <li>在不嚴重影響生活及工作條件的情形下，即使必須走上行政訴訟也不要放棄。</li>
                    <li>向您選區的議員、立法委員（交通委員為佳）提出，您受到來自警政、監理及環保機關不合理的檢驗及裁罰。</li>
                    <li>積極參與未來可能舉辦，任何有關於車輛檢驗相關之民意活動，包括：公聽會、說明會，甚至是抗爭行動。</li>
                  </ul>
                )
              } else {
                return (
                  <ul className="result-list">
                    <li>我幫不了你。</li>
                  </ul>
                )
              }
            })()}
          </div>
        )
      default:
        return null
    }
  }
}