<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Propuesta de pensión</title>
    <style>
        @page { margin: 28px 34px; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #263238; font-family: "DejaVu Sans", sans-serif; font-size: 10px; line-height: 1.35; }
        .header { border-bottom: 2px solid #2f6f67; padding-bottom: 13px; margin-bottom: 14px; }
        .eyebrow { color: #2f6f67; font-size: 8px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; }
        h1 { color: #173b3a; font-size: 23px; margin: 3px 0 8px; }
        .meta { width: 100%; border-collapse: collapse; }
        .meta td { padding: 1px 12px 1px 0; vertical-align: top; }
        .meta-label { color: #6b7b7a; font-size: 8px; text-transform: uppercase; }
        .meta-value { font-size: 10px; font-weight: bold; }
        .hero { background: #edf6f3; border-left: 5px solid #2f6f67; padding: 15px 18px; margin-bottom: 14px; }
        .hero table { width: 100%; border-collapse: collapse; }
        .hero-main { width: 42%; border-right: 1px solid #c8ddd8; }
        .hero-label { color: #496663; font-size: 9px; text-transform: uppercase; }
        .hero-amount { color: #173b3a; font-size: 25px; font-weight: bold; margin-top: 3px; }
        .metric { padding-left: 16px; vertical-align: top; }
        .metric-value { color: #173b3a; font-size: 13px; font-weight: bold; }
        .section { margin: 0 0 13px; page-break-inside: avoid; }
        .project-cost { page-break-before: always; padding-top: 5px; }
        .section-title { color: #2f6f67; font-size: 9px; font-weight: bold; letter-spacing: 1.2px; margin: 0 0 6px; text-transform: uppercase; }
        .card { border: 1px solid #dfe8e6; border-radius: 4px; padding: 8px 11px; }
        .grid { width: 100%; border-collapse: collapse; }
        .grid td { width: 33.33%; padding: 4px 9px 4px 0; vertical-align: top; }
        .field-label { color: #73807f; display: block; font-size: 8px; margin-bottom: 1px; }
        .field-value { color: #243332; font-size: 10px; font-weight: bold; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { background: #f3f6f5; color: #526361; font-size: 8px; padding: 6px 8px; text-align: left; text-transform: uppercase; }
        .data-table th:last-child, .data-table td:last-child { text-align: right; }
        .data-table td { border-bottom: 1px solid #e6ecea; padding: 5px 8px; }
        .data-table tr:last-child td { border-bottom: 0; }
        .subtotal td { background: #f8faf9; font-weight: bold; }
        .grand-total td { background: #e7f1ee; color: #173b3a; font-size: 11px; font-weight: bold; padding-top: 7px; padding-bottom: 7px; }
        .capital { background: #173b3a; color: #ffffff; padding: 14px 18px; page-break-inside: avoid; }
        .capital table { width: 100%; border-collapse: collapse; }
        .capital-label { font-size: 10px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; }
        .capital-note { color: #bdd4d0; font-size: 8px; margin-top: 2px; }
        .capital-amount { font-size: 24px; font-weight: bold; text-align: right; }
        .footer { border-top: 1px solid #dfe8e6; color: #75817f; font-size: 7px; margin-top: 11px; padding-top: 7px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <div class="eyebrow">Propuesta final cliente</div>
        <h1>PROPUESTA DE PENSIÓN</h1>
        <table class="meta">
            <tr>
                <td><span class="meta-label">Cliente</span><br><span class="meta-value">{{ $proposal->client['full_name'] }}</span></td>
                <td><span class="meta-label">NSS</span><br><span class="meta-value">{{ $proposal->client['nss'] }}</span></td>
                <td><span class="meta-label">Fecha de elaboración</span><br><span class="meta-value">{{ $proposal->generatedAt->format('d/m/Y') }}</span></td>
            </tr>
        </table>
    </div>

    <div class="hero">
        <table>
            <tr>
                <td class="hero-main">
                    <div class="hero-label">Pensión mensual estimada</div>
                    <div class="hero-amount">{{ \App\Helpers\CurrencyFormatter::format($proposal->pensionScenario['monthly_pension']) }}</div>
                </td>
                <td class="metric"><span class="meta-label">Semanas cotizadas</span><br><span class="metric-value">{{ number_format($proposal->pensionScenario['contributed_weeks'], 2) }}</span></td>
                <td class="metric"><span class="meta-label">Salario diario promedio</span><br><span class="metric-value">{{ \App\Helpers\CurrencyFormatter::format($proposal->pensionScenario['average_daily_salary']) }}</span></td>
                <td class="metric"><span class="meta-label">Edad estimada</span><br><span class="metric-value">{{ $proposal->pensionScenario['first_deposit_age'] }}</span></td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Datos generales</div>
        <div class="card">
            <table class="grid">
                <tr>
                    <td><span class="field-label">Nombre</span><span class="field-value">{{ $proposal->client['full_name'] }}</span></td>
                    <td><span class="field-label">CURP</span><span class="field-value">{{ $proposal->client['curp'] }}</span></td>
                    <td><span class="field-label">NSS</span><span class="field-value">{{ $proposal->client['nss'] }}</span></td>
                </tr>
                <tr>
                    <td><span class="field-label">Fecha de nacimiento</span><span class="field-value">{{ $proposal->client['birthdate']->format('d/m/Y') }}</span></td>
                    <td><span class="field-label">Edad</span><span class="field-value">{{ $proposal->client['age'] }}</span></td>
                    <td><span class="field-label">Estado civil</span><span class="field-value">{{ $proposal->client['marital_status'] }}</span></td>
                </tr>
                <tr>
                    <td><span class="field-label">Hijos menores o estudiantes</span><span class="field-value">{{ $proposal->client['children'] }}</span></td>
                    <td><span class="field-label">Padres registrados</span><span class="field-value">{{ $proposal->client['parents'] ?? 'No disponible' }}</span></td>
                    <td></td>
                </tr>
            </table>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Escenario de pensión</div>
        <table class="data-table">
            <tr><td>Semanas cotizadas alcanzadas</td><td>{{ number_format($proposal->pensionScenario['contributed_weeks'], 2) }}</td></tr>
            <tr><td>Salario diario promedio (últimas 250 semanas)</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->pensionScenario['average_daily_salary']) }}</td></tr>
            <tr><td>Edad al recibir primer depósito de pensión</td><td>{{ $proposal->pensionScenario['first_deposit_age'] }}</td></tr>
            <tr><td>Fecha estimada de inicio del trámite</td><td>{{ $proposal->pensionScenario['process_start_date']->format('d/m/Y') }}</td></tr>
            <tr><td>Pensión mensual alcanzada</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->pensionScenario['monthly_pension']) }}</td></tr>
            <tr><td>Pensión proyectada al siguiente año</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->pensionScenario['next_year_pension']) }}</td></tr>
            <tr><td>Aguinaldo</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->pensionScenario['christmas_bonus']) }}</td></tr>
        </table>
    </div>

    <div class="section project-cost">
        <div class="section-title">Inversión del proyecto</div>
        <table class="data-table">
            <thead><tr><th>Concepto</th><th>Importe</th></tr></thead>
            <tbody>
                <tr><td>Pago retroactivo Modalidad 40</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->projectCost['retroactive_modality_40']) }}</td></tr>
                <tr><td>Modalidad 10</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->projectCost['modality_10']) }}</td></tr>
                <tr><td>Ayuda por desempleo</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->projectCost['unemployment_assistance']) }}</td></tr>
                <tr><td>Seguro de vida</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->projectCost['life_insurance']) }}</td></tr>
                <tr><td>Aportación del cliente</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->projectCost['client_contribution']) }}</td></tr>
                <tr class="subtotal"><td>Total financiamiento</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->projectCost['total_financing']) }}</td></tr>
                <tr><td>Costo de financiamiento ({{ number_format($proposal->projectCost['financing_rate'] * 100, 0) }}%)</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->projectCost['financing_cost']) }}</td></tr>
                <tr><td>Honorarios</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->projectCost['fees']) }}</td></tr>
                <tr class="grand-total"><td>Costo total del proyecto</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->projectCost['total_project_cost']) }}</td></tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Recursos estimados por recuperar</div>
        <table class="data-table">
            <tr><td>Retroactivo de pensión</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->recoveredResources['pension_retroactive']) }}</td></tr>
            <tr><td>Retorno Modalidad 40</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->recoveredResources['modality_40_return']) }}</td></tr>
            <tr><td>AFORE + INFONAVIT</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->recoveredResources['afore_and_infonavit']) }}</td></tr>
            <tr class="grand-total"><td>Total recursos recuperados</td><td>{{ \App\Helpers\CurrencyFormatter::format($proposal->recoveredResources['total_recovered_resources']) }}</td></tr>
        </table>
    </div>

    <div class="capital">
        <table>
            <tr>
                <td><div class="capital-label">Capital libre estimado</div><div class="capital-note">Recursos estimados menos costo total del proyecto</div></td>
                <td class="capital-amount">{{ \App\Helpers\CurrencyFormatter::format($proposal->freeCapital) }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">Documento informativo. Los importes deberán validarse al formalizar el proyecto y la solicitud de pensión.</div>
</body>
</html>
