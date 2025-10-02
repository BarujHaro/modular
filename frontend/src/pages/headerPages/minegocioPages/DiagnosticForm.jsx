import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext.jsx";
import Analysis from './Analysis';
import "./DiagnosticForm.css";
import PDFDownload from './PDFDownload';
import { generateSmartTooltip } from './generateSmartTooltip.jsx';

const DiagnosticForm= () => {
  const { user} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); 
    }
  }, [user, navigate]);



  const [score, setScore] = useState('');
  const [explain, setExplain] = useState('');
  const [predictionTree, setPredictionTree] = useState('');
  const [scoreTree, setScoreTree] = useState([]);

  
  const [formData, setFormData] = useState({
    activo_corriente: "",
    pasivo_corriente: "",
    total_activos: "",
    total_pasivos: "",
    costo_ventas: "",
    inventario_inicial: "",
    inventario_final: "",
    ventas_credito: "",
    cuentas_por_cobrar: "",
    ventas_totales: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const SystemExpertDiagnosis = async() => {
    try {
      
        const res = await axios.post('http://localhost:5000/model/diagnostic', 
      formData
    );
    console.log(res);
        setScore(res.data.overall.score);
        
        setExplain(res.data.details);
       
        
        return {score: res.data.overall.score};
    } catch (error) {
      console.error('Error al calcular en el sistema experto:', error)
    }
  }

  const TreeDiagnosis = async() => {
    
    try{
      const response = await axios.post(
        "http://localhost:5000/model/predict",
        formData, 
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);
      setPredictionTree(response.data.prediction);

      setScoreTree([response.data.probability_class_0, response.data.probability_class_1]);
    
      return {predictionTree: response.data.prediction };
      
    }catch(error) {
      console.error('Error al calcular en el modelo:', error)
    }
  }

 

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
       const SEresult = await SystemExpertDiagnosis();

      const MLresult = await TreeDiagnosis();

          const payload = {
            ...formData,                 
            predictionTree: MLresult.predictionTree,   
            score: SEresult.score,
             user_id: user?.id                
          };
          


             const response = await axios.post(
              "http://localhost:5000/modelData",
              payload,
              { headers: { "Content-Type": "application/json" } }
            );

            console.log("Datos guardados correctamente");
              
    } catch (error) {
      console.error('Error al calcular:', error)
    }
  }


  const getDiagnostico = (score) => {
    if (score < 40) return "Riesgo de quiebra";
    if (score >= 40 && score <= 70) return "Empresa estable";
    if (score > 70) return "Empresa saludable";
    return "Sin diagnóstico";
  };

    const initialFormData = {
      activo_corriente: "",
      pasivo_corriente: "",
      total_activos: "",
      total_pasivos: "",
      costo_ventas: "",
      inventario_inicial: "",
      inventario_final: "",
      ventas_credito: "",
      cuentas_por_cobrar: "",
      ventas_totales: "",
    };

    const handleReset = () => {
      setFormData(initialFormData); 
      setScore("");              
      setExplain("");
      setPredictionTree("");
      setScoreTree([]);
    };

  const getSemaforoClass = (score, predictionTree) => {
    const isScorePositivo = getDiagnostico(score)  !== "Riesgo de quiebra";
    const isTreePositivo = predictionTree === 0; // 0 = fuera de riesgo

    if (isScorePositivo && isTreePositivo) {
      return "semaforo-verde";
    } else if (
      (isScorePositivo && !isTreePositivo) ||
      (!isScorePositivo && isTreePositivo)
    ) {
      return "semaforo-amarillo";
    } else {
      return "semaforo-rojo";
    }
  };

  return (
    <div className='main-cont'>
      <h2 className='semaforo'>Semáforo financiero</h2>
      <form onSubmit={handleSubmit} className='form-diagnostic'>
        <h3 className='title-diagnostic'>Formulario de evaluación

                    <span className="info-tooltip-icon">?
                      <span className="info-tooltip-text">
                        Información necesaria para obtener liquidez, endeudamiento, eficiencia operativa y rentabilidad de para evaluar la salud del negocio.
                      </span>
                    </span>


        </h3>
        <div className='form-Cont'>
            <div className='grid-cont'>
               
                <div className="form-group">
                  <label>
                Activos corrientes
                <span className="tooltip-icon">?
                  <span className="tooltip-text">
                    Recursos que se pueden volver dinero pronto. Ej. Valor del inventario, dinero en la cartera
                  </span>
                </span>
              </label>
                  <input 
                    type="number" 
                    name="activo_corriente"
                    value={formData.activo_corriente}
                    onChange={handleChange}
                    required 
                    placeholder="Ej. 6800"
                    className="form-input"/>
                </div>

                <div className="form-group">
                  <label>Pasivos corrientes

                    <span className="tooltip-icon">?
                      <span className="tooltip-text">
                        Deudas u obligaciones que se deben pagar en el corto plazo. Ej. Gasto de nomina, gastos de servicios, tarjeta de crédito a pagar
                      </span>
                    </span>
                  </label>
                  <input 
                  type="number" 
                  name="pasivo_corriente"
                  value={formData.pasivo_corriente}
                  onChange={handleChange}
                  required 
                  placeholder="Ej. 3200"
                  className="form-input"/>
                </div>

                <div className="form-group">
                    <label>Total de activos

                    <span className="tooltip-icon">?
                      <span className="tooltip-text">
                        Es todo lo que posee la empresa y que tiene algún valor económico. Ej. Valor del inventario, saldo en bancos, activos
                      </span>
                    </span>

                    </label>
                    <input 
                    type="number" 
                    name="total_activos"
                    value={formData.total_activos}
                    onChange={handleChange}
                    required 
                    placeholder="Ej. 12000"
                    className="form-input"/>
                </div>

                <div className="form-group">
                  <label>Total de pasivos

                    <span className="tooltip-icon">?
                      <span className="tooltip-text">
                        Es todo lo que la empresa debe a terceros. Ej. Gastos de nomina, impuestos, deudas
                      </span>
                    </span>


                  </label>
                    <input 
                    type="number" 
                    name="total_pasivos"
                    value={formData.total_pasivos}
                    onChange={handleChange}
                    required 
                    placeholder="Ej. 5500"
                    className="form-input"/>
                </div>

                <div className="form-group">
                  <label>Costo de ventas

                    <span className="tooltip-icon">?
                      <span className="tooltip-text">
                          Cuánto te costó producir lo que vendiste. Ej. Materia prima, mano de obra directa.
                      </span>
                    </span>



                  </label>
                    <input 
                    type="number" 
                    name="costo_ventas"
                    value={formData.costo_ventas}
                    onChange={handleChange}
                    required 
                    placeholder="Ej. 8500"
                    className="form-input"/>
                </div>

                  <div className="form-group">
                    <label>Ventas totales

                      <span className="tooltip-icon">?
                        <span className="tooltip-text">
                            Total de dinero que ingresó por ventas. Ej. Todo lo que vendiste (al contado + crédito).
                        </span>
                      </span>

                    </label>
                    <input 
                    type="number" 
                    name="ventas_totales"
                    value={formData.ventas_totales}
                    onChange={handleChange}
                    required 
                    placeholder="Ej. 12500"
                    className="form-input"/>
                  </div>



                <div className="form-group">
                  <label>Inventario inicial

                    <span className="tooltip-icon">?
                      <span className="tooltip-text">
                          Es el valor de los productos que la empresa tenía en existencia al inicio del periodo contable. Ej. Mercancía en almacén al comenzar el mes: $5,000.
                      </span>
                    </span>



                  </label>
                  <input 
                  type="number" 
                  name="inventario_inicial"
                  value={formData.inventario_inicial}
                  onChange={handleChange}
                  required 
                  placeholder="Ej. 1200"
                  className="form-input"/>
                </div>

                <div className="form-group">
                  <label>Inventario final

                    <span className="tooltip-icon">?
                      <span className="tooltip-text">
                          Es el valor de los productos que la empresa tiene en existencia al final del periodo contable. Ej. Mercancía que queda en almacén al cerrar el mes: $3,000.
                      </span>
                    </span>

                  </label>
                    <input 
                    type="number" 
                    name="inventario_final"
                    value={formData.inventario_final}
                    onChange={handleChange}
                    required 
                    placeholder="Ej. 950"
                    className="form-input"/>
                </div>

                <div className="form-group">
                  <label>Ventas a credito

                    <span className="tooltip-icon">?
                      <span className="tooltip-text">
                          Son las ventas donde el cliente paga después, no al momento de la compra. Ej. Ventas que pagarán después (30, 60, 90 días).
                      </span>
                    </span>

                  </label>
                    <input 
                    type="number" 
                    name="ventas_credito"
                    value={formData.ventas_credito}
                    onChange={handleChange}
                    required 
                    placeholder="Ej. 11000"
                    className="form-input"/>
                </div>

                <div className="form-group">
                  <label>Cuentas por cobrar

                    <span className="tooltip-icon">?
                      <span className="tooltip-text">
                          El dinero que te deben los clientes. Ej. Los clientes que compraron a crédito y aún no pagan.
                      </span>
                    </span>

                  </label>
                  <input 
                  type="number" 
                  name="cuentas_por_cobrar"
                  value={formData.cuentas_por_cobrar}
                  onChange={handleChange}
                  required 
                  placeholder="Ej. 2800"
                  className="form-input"/>
                </div>

                
             


            </div>

          <div>
            <button 
              type="submit" 
              className="btn-diagnostic"
            >
              Calcular Diagnóstico
            </button>
          </div>
        </div>
      </form>

      {score && (
        <div>
        <h2 className='title-diagnostic'>Diagnóstico financiero</h2>
        </div>
      )}

      <div className='cont-results'>
      {score && (
        <div className='cont-individual-result'>
        <h3 className='title-diagnostic'>Sistema experto

                    <span className="info-tooltip-icon">?
                      <span className="info-tooltip-text">
                        El sistema experto evalúa tus finanzas (liquidez, deudas, eficiencia y rentabilidad), 
                        les da una calificación y genera un puntaje global sobre la salud de tu negocio.

                      </span>
                    </span>

        </h3>
          <div className='data-diagnostic'>
            <p>Resultado: </p>
            <span>{getDiagnostico(score)}</span>

            <p>Puntaje: </p>
            <span>{score}</span>


              <div className='center-info'>
                <span className="info-tooltip-icon">?
                   {generateSmartTooltip(explain)}
                </span>
              </div>

          </div>
          
        </div>
      )}

      {scoreTree.length > 0 && predictionTree !== '' && (
        <div className='cont-individual-result'>
        <h3 className='title-diagnostic'>Aprendizaje máquina

                    <span className="info-tooltip-icon">?
                      <span className="info-tooltip-text">
                          Este modelo analiza la información financiera 
                          (como liquidez, deudas, ventas e inventarios) y la compara 
                          con patrones de otros negocios. 
                          Con eso predice si tu negocio está en riesgo o estable.
                      </span>
                    </span>

        </h3>
          <div className='data-diagnostic'>
            <p>
              Predicción: {" "} 
            </p>
              {predictionTree===0?(
                <span>Fuera de riesgo</span>
              ):(
                <span>En riesgo</span>
              )}
          
            <p>Puntaje estimado: </p>
            <span>{(Math.max(scoreTree[0],scoreTree[1]) * 100).toFixed(1)}%</span>
          
           <div className='center-info'>
                <span className="info-tooltip-icon">?
                    {predictionTree===0?(
                      <span className="info-tooltip-text">
                        
                        El modelo considera que tu negocio <b>no se encuentra en una situación crítica</b>. 
                        Sin embargo, revisa los indicadores financieros individuales para confirmar 
                        la estabilidad.

                      </span>
                    ):(
                      <span className="info-tooltip-text">
                        
                        El modelo estima que tu negocio <b>tiene factores de riesgo financiero</b>. 
                        Esto se debe a combinaciones de indicadores (ej. alto endeudamiento, baja liquidez o baja rentabilidad). 
                        Revisa las métricas específicas para entender las causas.

                      </span>
                    )}
                </span>
              </div>

          
          </div>
        </div>
      )}


      {scoreTree.length > 0 && predictionTree !== '' && score && (
        <div className='cont-individual-result'>
        <h3 className='title-diagnostic'>Semáforo

                    <span className="info-tooltip-icon">?
                      <span className="info-tooltip-text">
                        El semáforo toma el promedio de los resultados de ambos modelos.<br></br>
                        🟢 Ambos resultados son positivos<br></br>
                        🟡 Uno de los resultados es negativo<br></br>
                        🔴 Ambos resultados son negativos 
                      </span>
                    </span>

        </h3>
          <div  className={`semaforo-color ${getSemaforoClass(score, predictionTree)}`}>
          </div>
        </div>
      )}

      </div>

    {explain && (
      <div className='analysis-main-content'>
      <h2 className='title-diagnostic'>Análisis</h2>
      <Analysis explain={explain} />
          <button 
            type="button" 
            className="btn-diagnostic"
            onClick={handleReset}
                >
            Reiniciar
          </button>


          <PDFDownload
            formData={formData}
            score={score}
            predictionTree={predictionTree}
            scoreTree={scoreTree}
            explain={explain}
          />

        </div>
    )}


    </div>
  )
}

export default DiagnosticForm;