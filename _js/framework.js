/* ----------------------------------------------------------------------------------
	Generic Javascript framework
	
	Encoding:	UTF-8
	Author:		Juan G. Hurtado
	e-Mail:		juan.g.hurtado@gmail.com

-------------------------------------------------------------------------------------
	Table of contents
-------------------------------------------------------------------------------------
	1.AUTO SUBMIT
	2.EXPAND BLOCKS
	3.CONFIRMS
	4.TREE
	5.STYLE HELPER
---------------------------------------------------------------------------------- */

if (typeof jQuery != "undefined") {
	
	/* =AUTO SUBMIT
	----------------------------------------------------------------------------------
	1.1.Resumen:
	
		Este script nos permitirá realizar submit de un formulario al
		cambiar el valor seleccionado en un combo, o al pulsar sobre
		un checkbox o un botón de tipo radio.
		
		El submit se realizará gracias a un botón de submit que
		se pulsará mediante una simulación de "click" una vez cambiado
		el valor del campo de formulario. Este botón estará escondido si
		Javascript está activado. Si está desactivado, el botón será
		visible, permitiendo el funcionamiento normal del formulario
		y manteniendo la accesibilidad.
	
	1.2.Funcionamiento:
	
		El script buscará dos cosas dentro de un elemento cuya clase CSS
		sea "auto-submit":
		
		- Un elemento de tipo SELECT, un elemento INPUT de tipo "checkbox"
			o un elemento INPUT de tipo "radio"
		- Un botón de submit cuya clase CSS sea "submit"
		
		Seguidamente ocultará el botón de submit añadiéndole la clase
		CSS "hide" y asociará un evento "onchange" al elemento de
		formulario que haya encontrado. Ese evento lo que hará será
		simular un "click" sobre el botón de submit cada vez que
		el valor del campo de formulario cambie.
	
	1.3.Estructura HTML de ejemplo:
	
		<p class="auto-submit">
			<label for="select">Campo</label>
			<select id="select" name="select">
				<option value="valor1">Valor 1</option>
				<option value="valor2">Valor 2</option>
			</select>
			<input class="submit" type="submit" id="enviar" name="enviar" value="Enviar" />
		</p>
	---------------------------------------------------------------------------------- */
	var autoSubmit = {
		init : function() {
			jQuery('.auto-submit .submit').addClass('hide');
			
			jQuery('.auto-submit select, .auto-submit input:checkbox, .auto-submit input:radio').bind('change', function(e) {
				jQuery(this).parents('.auto-submit').find('.submit').click();
			});
		}
	};
	
	/* =EXPAND BLOCKS
	----------------------------------------------------------------------------------
	2.1.Resumen:
	
		Este script nos permitirá definir bloques expandibles, esto es, bloques
		que se mostrarán u ocultarán mediante el pulsado de otro elemento.
	
	2.2.Funcionamiento:
	
		El script busca dos elementos que deben estar envueltos dentro de otro
		cuya clase CSS debe ser "expand-wrapper":
		
		- Un elemento con clase CSS "expand-title", que actuará como "gatillo"
			para mostrar u ocultar el bloque destino
		- Un elemento con clase CSS "expand-body", que será el bloque que se
			mostrará u ocultará según el caso
			
		Una vez encontrados todos estos elementos, el funcionamiento por defecto
		del script será el de ocultar el bloque con clase CSS "expand-body",
		aunque podemos modificar este comportamiento haciendo que el bloque
		sea visible añadiendo la clase "visible" al bloque.
		
		Además de ocultar o mostrar este bloque en la carga de la página, el
		script añade un evento "onclick" al elemento con clase CSS "expand-title".
		Este evento se dispara al clickar en el elemento, y se encargará de mostrar
		u ocultar el bloque con clase CSS "expand-body" según convenga: lo ocultará
		si era visible, y lo mostrará si estaba oculto.
		
		En el proceso se añaden y quitan una serie de clases CSS a ciertos elementos
		para facilitar su estilizado:
		
		- Al elemento con clase "expand-title":
			* Se le añade la clase "opened" si el bloque destino está visible
			* Se le añade la clase "closed" si el bloque destino está oculto
	
	2.3.Estructuras HTML de ejemplo:
		
		Ejemplo simple:
		
		<div class="expand-wrapper">
			<h1 class="expand-title">expand-title</h1>
			<p class="expand-body">Lorem ipsum dolor sit amet…</p>
		</div>
		
		Ejemplo con el bloque destino definido como visible en la carga de página:
		
		<div class="expand-wrapper">
			<p><strong class="expand-title">expand-title</strong></p>
			<div class="expand-body visible">
				<p>Lorem ipsum dolor sit amet…</p>
				<p>Lorem ipsum dolor sit amet…</p>
			</p>
		</div>
	---------------------------------------------------------------------------------- */
	var expand = {
		init : function() {
			jQuery('.expand-wrapper').filter(function() {
				return !jQuery(this).find('.expand-title').hasClass('closed') && !jQuery(this).find('.expand-title').hasClass('opened');
			})
			.find('.expand-body:not(.visible)').hide()
			.end().find('.expand-title:first').each(function() {
				var element = jQuery(this).parents('.expand-wrapper:first').find('.expand-body');
				if (element.css('display') == "none") {
					element.addClass('hidden');
					jQuery(this).addClass('closed');
					element.parents('.expand-wrapper:first').removeClass('current');
				}
				else {
					element.addClass('visible');
					jQuery(this).addClass('opened');
					element.parents('.expand-wrapper:first').addClass('current');
				}
			}).css('cursor','pointer')
			.bind('click',function(e) {
				var element = jQuery(this).parents('.expand-wrapper:first').find('.expand-body:first');

				jQuery(this).toggleClass('closed');
				jQuery(this).toggleClass('opened');
				
				element.toggleClass('visible');
				element.toggleClass('hidden');
				
				var fade = element.hasClass('fade');
				
				if (element.css('display') == "none") {
					element.parents('.expand-wrapper:first').toggleClass('current');
					if (fade) {
						element.fadeIn(200);
					} else {
						element.slideDown('slow');
					}
				} else {
					if (fade) {
						element.fadeOut(200, function() {
							element.parents('.expand-wrapper:first').toggleClass('current');
						});
					} else {
						element.slideUp('slow', function() {
							element.parents('.expand-wrapper:first').toggleClass('current');
						});
					}
				}
				
				e.preventDefault();
			});
		}
	};
	
	/* =CONFIRMS
	----------------------------------------------------------------------------------
	3.1.Resumen:
	
		Este script permite lanzar un mensaje de confirmación antes de efectuar 
		una acción al clickar un elemento. Generalmente se usará sobre enlaces
		o sobre botones de formulario.
	
	3.2.Funcionamiento:
	
		El script busca los elementos cuya clase CSS sea "confirm", a todos ellos
		les añade la clase "confirm-binded" para controlar que ya tiene definido
		el comportamiento de confirmación.
		
		Además les asocia un evento "onclick" en el cual lanzan la pregunta de
		confirmación utilizando el texto del atributo "title" del elemento (si
		no lo tuviera, se usa un texto por defecto). Si se acepta el mensaje
		en el cuadro de confirmación, se efectua la acción. Si no se acepta,
		la acción queda cancelada.
	
	3.3.Estructuras HTML de ejemplo:
	
		Enlace con mensaje de confirmación por defecto:
		
		<a href="#" class="confirm">Enlace</a>
		
		Botón de formulario con mensaje de confirmación personalizado:
		
		<input type="submit" value="Enviar" title="¿Seguro?" class="confirm" />
	---------------------------------------------------------------------------------- */
	var confirmation = {

		init : function() {
			var elements = jQuery('.confirm:not(.confirm-binded)');

			elements.addClass('confirm-binded').bind('click', function() {
				return confirmation.ask(jQuery(this).attr('title'));
			});
		},

		ask : function(title) {
			var title = (title==null || title=="")?"¿Seguro que desea realizar la acción?":title;

			return confirm(title);
		}

	};
	
	/* =TREE
	----------------------------------------------------------------------------------
	4.1.Resumen:
	
		Este script añade el comportamiento necesario para transformar una lista
		anidada con enlaces en un "arbol" desplegable.
		
	
	4.2.Funcionamiento:
	
		La primera acción del script es ocultar los elementos UL que no son de
		primer nivel. Por tanto el arbol aparece plegado por defecto, aunque
		existe una forma de hacer que los sub-menus aparezcan desplegados, esto es
		colocando la clase CSS "visible" al UL que queramos que esté visible
		por defecto (teniendo en cuenta el anidamiento: si colocamos la clase
		en un UL de nivel interno y no en el superior, el interno no será visible
		en la carga de la página, sino cuando abramos ese UL de nivel superior).
		
		Posteriormente busca los enlaces que se van a encargar de plegar/desplegar
		los sub-menús (estos enlaces son los que tienen como "hermanos" algún
		elemento UL). A estos enlaces se les añade el comportamiento de plegado
		y desplegado del pertinente UL.
		
		Durante este proceso de plegado/desplegado se añaden o quitan, según
		el caso, una serie de clases CSS para facilitar el estilizado del
		componente. Estas clases son:
		
		- Cuando el elemento está plegado: No hay ninguna clase CSS
		- Cuando el elemento está desplegado:
			* Se añade la clase CSS "current" al enlace que ha provocado
				el desplegado
			* Se añade la clase CSS "current" al elemento UL desplegado
			* Se añade la clase CSS "current" al elemento LI padre del
			 	enlace y del UL desplegado
	
	4.3.Estructura HTML de ejemplo:
	
		<ul class="tree">
			<li>
				<a href="#">Opción</a>
				<ul class="visible">
					<li><a href="#">Opción</a></li>
					<li>
						<a href="#">Opción</a>
						<ul>
							<li><a href="#">Opción</a></li>
							<li><a href="#">Opción</a></li>
							<li><a href="#">Opción</a></li>
						</ul>
					</li>
					<li><a href="#">Opción</a></li>
				</ul>
			</li>
			<li><a href="#">Opción</a></li>
			<li><a href="#">Opción</a></li>
		</ul>
	---------------------------------------------------------------------------------- */
	var tree = {

		init : function() {
			jQuery('ul.tree li ul:not(.visible)').hide();
			
			jQuery('ul.tree li ul.visible').toggleClass('current')
				.siblings('a').toggleClass('current')
				.parent().toggleClass('current');;
			
			// Obtenemos los enlaces que deben plegar/desplegar submenus
			var elements = jQuery('ul.tree li a').filter(function() {
				return jQuery(this).siblings('ul').length > 0;
			});
			
			elements.bind('click', function(e) {
				if (jQuery(this).siblings('ul').css('display') == 'none') {
					jQuery(this).siblings('ul').slideDown('slow').toggleClass('current')
						.end().toggleClass('current')
						.parent().toggleClass('current');
				} else {
					jQuery(this).siblings('ul').slideUp('slow', function() {
						jQuery(this).toggleClass('current')
							.siblings('a').toggleClass('current')
							.parent().toggleClass('current');
					});
				}
				
				e.preventDefault();
			});
		}

	};
	
	/* =STYLE HELPER
	----------------------------------------------------------------------------------
	5.1.Resumen:
	
		Este script engloba algunos metodos para facilitar la estilización de
		elementos de manera sencilla, supliendo algunas de las carencias de soporte
		en lo referente a CSS. P. ej. un metodo para añadir clases CSS específicas
		al primer y al último elemento de un grupo.
	
	5.2.Funcionamiento:
	
		firstLast(parent,child): Este método busca todos los "children" dentro de "parent",
								y al primero le coloca la clase CSS "first" y al último
								la clase CSS "last"
								
		odd(parent,child): Este método busca todos los "children" dentro de "parent",
								y coloca la clase CSS "par" a los pares, e "impar" a los
								impares
								
		addHover(elements): Este método añade la clase CSS "hover" a todos los "elements"
								cuando el ratón pasa por encima de ellos y lo quita cuando
								ya no pasa por encima
	
	---------------------------------------------------------------------------------- */
	var styleHelper = {

		firstLast : function(parent, child) {
			jQuery(parent).each(function() {
				var element = jQuery(this).children(child +':first');
				element.addClass('first');
				
				var element = jQuery(this).children(child +':last');
				element.addClass('last');
			});
		},
		
		odd : function(parent, child) {
			jQuery(parent).each(function() {
				// No seguimos el nombrado lógico para la clase, ya que jQuery
				// obtiene los pares/impares según un índice 0, es decir, para
				// jQuery el primero elemento de una lista es par porque su
				// índice es igual a cero, siendo impar el segundo elemento.
				// Para nuestras intenciones este comportamiento no es correcto
				var element = jQuery(this).children(child +':even');
				element.addClass('odd');
				
				var element = jQuery(this).children(child +':odd');
				element.addClass('even');
			});
		},
		
		addHover : function(elements) {
			jQuery(elements).hover(function() {
				jQuery(this).addClass('hover');
			}, function() {
				jQuery(this).removeClass('hover')
			});
		}
	};
}